export const xpInfo = {
    dailyLogin: 5,
    reflection: 15,
    jorunal: 10,
    mood: 10,
    task: 10,
    baseXP: 50
}

export const all_activites = [{
    key: "🔒 Daily Login",
    value: xpInfo.dailyLogin,
    is_completed: 0,
},
{
    key: "📝 Daily Reflection",
    value: xpInfo.reflection,
    is_completed: 0,
},
{
    key: "💝 Mood Logged",
    value: xpInfo.mood,
    is_completed: 0
},
{
    key: "📝 Daily Journal",
    value: xpInfo.jorunal,
    is_completed: 0
},
{
    key: '✅ Daily Tasks',
    value: xpInfo.task,
    is_completed: 0
}
]

export function checkLevel(xp: number) {
    const currentLevel = Math.floor(Math.sqrt(xp / xpInfo.baseXP));
    const startXP = xpInfo.baseXP * (currentLevel * currentLevel);
    const nextXP = xpInfo.baseXP * ((currentLevel + 1) * (currentLevel + 1));
    console.log(xp, startXP, nextXP)
    return {
        currentLevel,
        nextLevelXP: nextXP,
        progress: Math.floor(calculateLevelProgress(xp, startXP, nextXP))
    }
}

function calculateLevelProgress(xp: number, startXP: number, nextXP: number) {
    if (nextXP === startXP) return 100; // Avoid division by zero
    let progress = ((xp - startXP) / (nextXP - startXP)) * 100;
    return Math.max(0, Math.min(100, progress)); // Clamp between 0 and 100
}

export function getSuccessRate(completedTasks:any, allTasks:any) {
    if (allTasks === 0) return 0; // avoid divide-by-zero
    return ((completedTasks / allTasks) * 100).toFixed(); // 2 decimal places
}