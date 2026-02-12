// --- הוספנו את השורה הזו כדי שהקובץ יכיר את Family ---
import { Family } from '../src/types'; 

// מילון המרה אוטומטי (Sesto -> Quartiere)
const SESTO_TO_QUARTIERE_MAP: Record<string, string> = {
    "Sesto d'Oltrarno": "Santo Spirito",
    "Sesto di San Pier Scheraggio": "Santa Croce",
    "Sesto di Borgo": "Santa Croce", // ברירת מחדל (אם אין דריסה ידנית)
    "Sesto di San Pancrazio": "Santa Maria Novella",
    "Sesto di Porta del Duomo": "San Giovanni",
    "Sesto di Porta San Piero": "San Giovanni" // ברירת מחדל
};

// הפונקציה הראשית
export const getFamilyDistrict = (family: Family, year: number): string => {
    // 1. לפני 1343: תמיד מחזירים את ה-Sesto המקורי
    if (year < 1343) {
        return family.sesto || "Unknown";
    }

    // 2. אחרי 1343: קודם בודקים אם יש דריסה ידנית מהטבלה
    if (family.manualQuartiere && family.manualQuartiere.trim() !== '') {
        return family.manualQuartiere; // מיכל קבעה ידנית!
    }

    // 3. אם אין דריסה ידנית: משתמשים במיפוי האוטומטי
    if (family.sesto && SESTO_TO_QUARTIERE_MAP[family.sesto]) {
        return SESTO_TO_QUARTIERE_MAP[family.sesto];
    }

    return family.sesto || "Unknown"; // Fallback
};