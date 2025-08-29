import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Editor, NgxEditorComponent, toHTML } from 'ngx-editor';
import { format } from 'date-fns';
import { SmartHttpService } from '../../services/smart-http.service';
import { Skeleton } from '../../shared/skeleton/skeleton';
import { StorageService } from '../../services/storage.service';
import { EncryptionService } from '../../services/encryption.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-journal',
  imports: [CommonModule, NgxEditorComponent, FormsModule, Skeleton],
  templateUrl: './journal.html',
  styleUrl: './journal.scss'
})
export class Journal implements OnInit {
  editor!: Editor;

  cipherData = signal<{ ciphertext: string, iv: string }>({ ciphertext: '', iv: '' });
  isEditor = signal<boolean>(false);
  editorText = signal<string>('No Entry Found');
  dateParam = signal<string>("");
  currentDate = signal<string>("");
  insightData = signal<any>({});
  loading = signal<boolean>(true);
  isEncrypted = signal<boolean>(true);
  passphraseText = signal<string>("");
  private key!: CryptoKey;
  private salt!: Uint8Array;

  private platformId = inject(PLATFORM_ID);
  private location = inject(Location);
  private storage = inject(StorageService);
  private route = inject(ActivatedRoute);
  private http = inject(SmartHttpService);
  private encryptionService = inject(EncryptionService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.editor = new Editor();
      this.isEditor.set(true);
      this.fetchInsights();
    }
  }

  private fetchInsights = () => {
    try {
      this.dateParam.set(this.route.snapshot.paramMap.get("date") || "");
      this.currentDate.set(format(new Date(this.dateParam()), "EEEE, MMMM d, yyyy"));
      this.http.post("stats/journal-insights", { date: this.dateParam() }).subscribe({
        next: (res: any) => {
          if (res && res.status === 200) {
            this.loading.set(false);
          }
          if (res && res.status === 200 && res.data) {
            this.cipherData.set(res.data);
          }else {
            this.isEncrypted.set(false);
          }
        }
      })

    } catch (error) {
      alert(error);
    }
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
        this.editorText.set(decrypt);
      }
      this.isEncrypted.set(false);
    } catch (error: any) {
      this.toastr.error("Invalid Passphrase!", "Error!");
    }
  }
    onPassphraseInput = (value: string) => {
    this.passphraseText.set(value);
  }

    exportData = () => {
      if (!this.isEncrypted() && this.cipherData().ciphertext !== "" && this.cipherData().iv !== "" && this.editorText() !== "") {
        
        // Convert to HTML
        const html = this.editorText();
        // Example: download as file
        const blob = new Blob([html], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentDate()}-journal.html`;
        a.click();
      }
  
    }
  


  goBack = () => {
    this.location.back();
  }

}