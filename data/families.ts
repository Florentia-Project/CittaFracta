// src/data/families.ts
import { Family } from '../src/types';

export const FAMILIES_DATA: Family[] = [
    // --- משפחות שמצאת להן מיקום (עם הקואורדינטות שלך) ---
    
    // 1038: Abati
    { 
        id: '1038', 
        name: 'Abati', 
        mapRef: 1, 
        sesto: 'Sesto di Porta San Piero', // הנחה לפי המיקום
        coordinates: { x: 43.77192892633522, y: 11.25367212088505 } 
    },

    // 1012: Acciaiuoli
    { 
        id: '1012', 
        name: 'Acciaiuoli', 
        mapRef: 2, 
        sesto: 'Sesto di Borgo', 
        coordinates: { x: 43.7691935900354, y: 11.253014942381872 } 
    },

    // 1039: Adimari (מתחם של 4 מגדלים שמצאת)
    { 
        id: '1039', 
        name: 'Adimari (Main)', 
        mapRef: 3, 
        sesto: 'Sesto di Porta San Piero',
        coordinates: { x: 43.77273926351342, y: 11.255001064524983 } 
    },
    { 
        id: '1039_2', 
        name: 'Adimari (Tower II)', 
        mapRef: 3, 
        sesto: 'Sesto di Porta San Piero',
        coordinates: { x: 43.77248764385079, y: 11.255387536119349 } 
    },
    { 
        id: '1039_3', 
        name: 'Adimari (Tower III)', 
        mapRef: 3, 
        sesto: 'Sesto di Porta San Piero',
        coordinates: { x: 43.77218956995746, y: 11.255328491847957 } 
    },
    { 
        id: '1039_4', 
        name: 'Adimari (Tower IV)', 
        mapRef: 3, 
        sesto: 'Sesto di Porta San Piero',
        coordinates: { x: 43.77219344105652, y: 11.255167462017006 } 
    },

    // 1040: Agli (2 מגדלים שמצאת)
    { 
        id: '1040', 
        name: 'Agli', 
        mapRef: 4, 
        sesto: 'Sesto di San Pancrazio',
        coordinates: { x: 43.77279732943909, y: 11.252279660381467 } 
    },
    { 
        id: '1040_2', 
        name: 'Agli (Tower II)', 
        mapRef: 4, 
        sesto: 'Sesto di San Pancrazio',
        coordinates: { x: 43.77253796786798, y: 11.25274664689129 } 
    },

    // 1041: Alberti (2 מגדלים שמצאת)
    { 
        id: '1041', 
        name: 'Alberti', 
        mapRef: 5, 
        sesto: 'Sesto di San Piero Scheraggio', // אזור סנטה קרוצ'ה
        coordinates: { x: 43.768040673607246, y: 11.25986138292409 } 
    },
    { 
        id: '1041_2', 
        name: 'Alberti (Tower II)', 
        mapRef: 5, 
        sesto: 'Sesto di San Piero Scheraggio',
        coordinates: { x: 43.76717348095391, y: 11.259024027803008 } 
    },


    // --- דוגמאות למשפחות שעדיין צריך למצוא (שימי לב ל-NULL) ---
    { id: '1000', name: 'Medici', mapRef: 39, coordinates: { x: null, y: null } },
    { id: '1001', name: 'Albizzi', mapRef: 6, coordinates: { x: null, y: null } },
    { id: '1002', name: 'Strozzi', mapRef: 56, coordinates: { x: null, y: null } },
    { id: '1010', name: 'Bardi', mapRef: 11, coordinates: { x: null, y: null } },
    { id: '1011', name: 'Peruzzi', mapRef: 43, coordinates: { x: null, y: null } },
    { id: '1015', name: 'Pitti', mapRef: 44, coordinates: { x: null, y: null } },
    { id: '1016', name: 'Rucellai', mapRef: 49, coordinates: { x: null, y: null } },
];
