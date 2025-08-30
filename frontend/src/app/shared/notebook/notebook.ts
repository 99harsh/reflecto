import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, inject, OnInit, PLATFORM_ID, signal, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SavingLoading } from '../saving-loading/saving-loading';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor } from 'ngx-editor';
import { SmartHttpService } from '../../services/smart-http.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { format } from 'date-fns';
import { Skeleton } from '../skeleton/skeleton';
import { EncryptionService } from '../../services/encryption.service';
import { StorageService } from '../../services/storage.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-notebook',
  imports: [CommonModule, FormsModule, SavingLoading, NgxEditorComponent, NgxEditorMenuComponent, Skeleton],
  templateUrl: './notebook.html',
  styleUrl: './notebook.scss',
  encapsulation: ViewEncapsulation.None
})
export class Notebook implements OnInit {
  journalContent = ""
  lineCount = 25
  textareaRows = 25
  editor!: Editor;

  cipherData = signal<{ ciphertext: string, iv: string }>({ ciphertext: '', iv: '' });
  loading = signal<boolean>(true);
  currentDate = signal<string>('');
  updatedAt = signal<string>('');
  isEditor = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  journalText = signal<string>('');
  journalData = signal<any>({});

  isEncrypted = signal<boolean>(true);
  isNewEntry = signal<boolean>(false);
  passphraseText = signal<string>("");

  private platformId = inject(PLATFORM_ID);
  private http = inject(SmartHttpService);
  private encryptionService = inject(EncryptionService);
  private storage = inject(StorageService);
  private toastr = inject(ToastrService);
  private analytics = inject(AnalyticsService);

  private inputSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private key!: CryptoKey;
  private salt!: Uint8Array;


  ngOnInit(): void {
    this.currentDate.set(format(new Date(), "EEEE, MMMM d, yyyy"));
    if (isPlatformBrowser(this.platformId)) {
      this.editor = new Editor();
      this.isEditor.set(true);
    }
    this.checkPassphrase();
    this.fetchJournalData();
    this.registerSaveJournalListner();
  }

  checkPassphrase = () => {
  
  }

  fetchJournalData = () => {
    this.http.get("journal/get").subscribe({
      next: (res: any) => {
        if (res && res.status === 200) {
          this.loading.set(false);
        }
        if (res && res.status === 200 && res.data && res?.data?.ciphertext !== '') {
          this.journalText.set(res.data?.journal);
          this.journalData.set(res.data)
          this.cipherData.set({ ciphertext: res.data?.ciphertext, iv: res.data?.iv })
          this.isNewEntry.set(false);
        } else {
          this.isNewEntry.set(true);
        }
      }
    })
  }

  onPassphraseInput = (value: string) => {
    this.passphraseText.set(value);
  }

  lockUnlockContent = async () => {
    try {
      const user_profile: any = JSON.parse(this.storage.getItem("user_profile") || "");
      this.salt = new Uint8Array(Object.values(user_profile.salt));
      this.key = await this.encryptionService.deriveKey(this.passphraseText(), this.salt);
      if (this.cipherData()?.ciphertext && this.cipherData()?.iv) {
        const decrypt = await this.encryptionService.decrypt(
          this.cipherData().ciphertext,
          this.cipherData().iv,
          this.key
        );
        this.journalText.set(decrypt);
        this.analytics.track("Unlock Journal");
      }else{
        this.analytics.track("Lock Journal");
      }
      this.isEncrypted.set(false);
    } catch (error: any) {
      this.toastr.error("Invalid Passphrase!", "Error!");
    }
  }

  private registerSaveJournalListner() {
    this.inputSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    )
      .subscribe(async (val) => {
        const encrypted = await this.encryptionService.encrypt(val, this.key);
        this.saveJournal(encrypted);
      });
  }

  private saveJournal = (value: any) => {
    this.isSaving.set(true);
    this.http.post('journal/save', {
      journal_id: this.journalData()?.journal_id,
      ...value
    }).subscribe({
      next: (resp: any) => {
        if (resp && resp.status === 200) {
          this.journalData.set(resp.data);
          this.updatedAt.set(resp.data.updated_at);
        }
      },
      complete: () => {
        this.isSaving.set(false);
      }
    })
  }


  onTextChange = (event: string) => {
    if (event === this.journalText()) return;
    this.journalText.set(event);
    this.inputSubject.next(event);
  }

  getLineArray(): number[] {
    return Array(this.lineCount)
      .fill(0)
      .map((_, i) => i + 1)
  }

  getHoleArray(): number[] {
    return Array(Math.min(20, Math.floor(this.lineCount / 2.5)))
      .fill(0)
      .map((_, i) => i + 1)
  }

  trackByIndex(index: number): number {
    return index
  }


  ngOnDestroy() {
    if (this.isEditor()) {
      this.editor.destroy();
    }
  }
}
