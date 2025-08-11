export const dateFilter = (body_date?: any) => {
    //  format: YYYY-MM-DD
    const baseDate = body_date ? new Date(body_date) : new Date(); // default: today

    const startOfDay = new Date(baseDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(baseDate);
    endOfDay.setHours(23, 59, 59, 999);
    return {
        gte: startOfDay,
        lt: endOfDay
    }
}