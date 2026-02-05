// 10/10 GOAT Life System - Constants and Seed Data

export const CATEGORIES = [
  { id: 'intelecto', name: 'Intelecto', subtitle: 'Tec 2027', color: 'category-intelecto', icon: 'Brain' },
  { id: 'fisico', name: 'Físico & Atletismo', subtitle: 'Ironman', color: 'category-fisico', icon: 'Dumbbell' },
  { id: 'proyecto', name: 'Proyecto', subtitle: 'WAF', color: 'category-proyecto', icon: 'Rocket' },
  { id: 'contenido', name: 'Contenido', subtitle: '', color: 'category-contenido', icon: 'Video' },
  { id: 'disciplina', name: 'Disciplina', subtitle: '', color: 'category-disciplina', icon: 'Target' },
  { id: 'estilo', name: 'Estilo', subtitle: '', color: 'category-estilo', icon: 'Sparkles' },
  { id: 'relaciones', name: 'Relaciones', subtitle: '', color: 'category-relaciones', icon: 'Heart' },
  { id: 'aura', name: 'Aura', subtitle: '', color: 'category-aura', icon: 'Zap' },
  { id: 'espiritualidad', name: 'Espiritualidad', subtitle: '', color: 'category-espiritualidad', icon: 'Sun' },
] as const;

export const SEED_HABITS = [
  // Intelecto
  { name: 'Estudiar 2h+', categoryId: 'intelecto', isKey: true, frequency: 'daily' },
  { name: 'Leer 30 min', categoryId: 'intelecto', isKey: false, frequency: 'daily' },
  { name: 'Practicar código', categoryId: 'intelecto', isKey: true, frequency: 'daily' },
  
  // Físico & Atletismo
  { name: 'Entrenar 1h+', categoryId: 'fisico', isKey: true, frequency: 'daily' },
  { name: 'Nadar 45 min', categoryId: 'fisico', isKey: true, frequency: 'weekly' },
  { name: 'Correr 5km+', categoryId: 'fisico', isKey: true, frequency: 'weekly' },
  { name: 'Dormir 7h+', categoryId: 'fisico', isKey: true, frequency: 'daily' },
  
  // Proyecto
  { name: 'WAF 2h trabajo profundo', categoryId: 'proyecto', isKey: true, frequency: 'daily' },
  { name: 'Revisar métricas', categoryId: 'proyecto', isKey: false, frequency: 'weekly' },
  
  // Contenido
  { name: 'Crear contenido', categoryId: 'contenido', isKey: true, frequency: 'daily' },
  { name: 'Publicar post', categoryId: 'contenido', isKey: false, frequency: 'weekly' },
  
  // Disciplina
  { name: 'Despertar 6am', categoryId: 'disciplina', isKey: true, frequency: 'daily' },
  { name: 'Sin redes 2h+', categoryId: 'disciplina', isKey: true, frequency: 'daily' },
  { name: 'Planear día', categoryId: 'disciplina', isKey: false, frequency: 'daily' },
  
  // Estilo
  { name: 'Vestir bien', categoryId: 'estilo', isKey: false, frequency: 'daily' },
  { name: 'Skincare AM/PM', categoryId: 'estilo', isKey: true, frequency: 'daily' },
  
  // Relaciones
  { name: 'Llamar familia', categoryId: 'relaciones', isKey: true, frequency: 'weekly' },
  { name: 'Quality time', categoryId: 'relaciones', isKey: false, frequency: 'daily' },
  
  // Aura
  { name: 'Meditar 10min', categoryId: 'aura', isKey: true, frequency: 'daily' },
  { name: 'Journaling', categoryId: 'aura', isKey: false, frequency: 'daily' },
  
  // Espiritualidad
  { name: 'Gratitud 3 cosas', categoryId: 'espiritualidad', isKey: true, frequency: 'daily' },
  { name: 'Reflexión semanal', categoryId: 'espiritualidad', isKey: false, frequency: 'weekly' },
];

export const CLASSIFICATION_THRESHOLDS = {
  FLOJO: { max: 50, label: 'Flojo', class: 'classification-flojo' },
  SOLIDO: { min: 50, max: 80, label: 'Sólido', class: 'classification-solido' },
  GOD: { min: 80, label: 'GOD', class: 'classification-god' },
} as const;

export const LEVEL_CONFIG = {
  BASE_LEVEL: 7.0,
  MAX_DAILY_DECREASE: 0.3,
  KEY_HABIT_PENALTY: 0.1,
  STREAK_BONUS: 0.1,
  MIN_LEVEL: 1.0,
  MAX_LEVEL: 10.0,
} as const;

export type CategoryId = typeof CATEGORIES[number]['id'];
