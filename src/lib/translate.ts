/**
 * Auto-translation utility using MyMemory free API.
 * Detects the source language and translates to the other two (fr, ar, en).
 * Free tier: 5000 chars/day without API key.
 */

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

// Detect if text is primarily Arabic
function isArabic(text: string): boolean {
  const arabicChars = text.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g);
  if (!arabicChars) return false;
  // Consider it Arabic if >30% of non-space chars are Arabic
  const nonSpaceChars = text.replace(/\s/g, '').length;
  return arabicChars.length / nonSpaceChars > 0.3;
}

// Detect if text is primarily French (has French-specific characters/words)
function isFrench(text: string): boolean {
  const frenchIndicators = /[àâäéèêëïîôùûüÿçœæ]|(\b(le|la|les|un|une|des|du|de|et|en|est|pour|avec|dans|sur|par|qui|que|ce|cette|sont|pas|nous|vous)\b)/gi;
  const matches = text.match(frenchIndicators);
  return (matches && matches.length >= 2) || false;
}

type DetectedLang = 'ar' | 'fr' | 'en';

function detectLanguage(text: string): DetectedLang {
  if (isArabic(text)) return 'ar';
  if (isFrench(text)) return 'fr';
  return 'en';
}

async function translateText(text: string, from: string, to: string): Promise<string | null> {
  if (!text || text.trim().length === 0) return null;
  
  try {
    const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`[Translate] API returned ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      // MyMemory sometimes returns the same text or an error message
      if (translated.toUpperCase() === translated && text.toUpperCase() !== text) {
        // All caps usually means an error/warning from MyMemory
        return null;
      }
      return translated;
    }
    
    return null;
  } catch (err) {
    console.warn('[Translate] Error:', err);
    return null;
  }
}

export interface TranslationResult {
  name_fr: string;
  name_ar: string | null;
  name_en: string | null;
  description_fr: string;
  description_ar: string | null;
  description_en: string | null;
}

/**
 * Auto-translate product name and description to all 3 languages.
 * Takes the original text, detects the language, and translates to the other two.
 */
export async function autoTranslateProduct(
  name: string,
  description: string
): Promise<{
  name_ar: string | null;
  name_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  sourceLang: DetectedLang;
}> {
  const nameLang = detectLanguage(name);
  const descLang = detectLanguage(description);
  
  // Use description language as the primary indicator (longer text = more accurate detection)
  const sourceLang = descLang;
  
  const targets: DetectedLang[] = (['ar', 'fr', 'en'] as DetectedLang[]).filter(l => l !== sourceLang);
  
  console.log(`[Translate] Detected source language: ${sourceLang}, translating to: ${targets.join(', ')}`);
  
  // Map MyMemory language codes
  const langCodeMap: Record<string, string> = { ar: 'ar', fr: 'fr', en: 'en' };
  
  // Translate name and description to both target languages in parallel
  const [nameT1, nameT2, descT1, descT2] = await Promise.all([
    translateText(name, langCodeMap[nameLang], langCodeMap[targets[0]]),
    translateText(name, langCodeMap[nameLang], langCodeMap[targets[1]]),
    translateText(description, langCodeMap[sourceLang], langCodeMap[targets[0]]),
    translateText(description, langCodeMap[sourceLang], langCodeMap[targets[1]]),
  ]);
  
  // Build result based on source language
  const result: Record<string, string | null> = {
    name_ar: null,
    name_en: null,
    description_ar: null,
    description_en: null,
  };
  
  if (sourceLang === 'ar') {
    // Source is Arabic → translate to French & English
    result.name_en = nameT2;      // targets[1] = en
    result.description_en = descT2;
    // name (French) = translated from Arabic
    // We return fr translations via a different field since 'name' is the default fr field
  } else if (sourceLang === 'fr') {
    // Source is French → translate to Arabic & English
    result.name_ar = nameT1;      // targets[0] = ar
    result.name_en = nameT2;      // targets[1] = en
    result.description_ar = descT1;
    result.description_en = descT2;
  } else {
    // Source is English → translate to Arabic & French
    result.name_ar = nameT1;      // targets[0] = ar
    result.description_ar = descT1;
    // French translations go back into the 'name'/'description' main fields
  }
  
  return {
    name_ar: result.name_ar,
    name_en: result.name_en,
    description_ar: result.description_ar,
    description_en: result.description_en,
    sourceLang,
  };
}

/**
 * Full translation that returns all three language versions of name and description.
 */
export async function translateProductFields(
  name: string,
  description: string
): Promise<TranslationResult> {
  const sourceLang = detectLanguage(description.length > 0 ? description : name);
  
  const langCodeMap: Record<string, string> = { ar: 'ar', fr: 'fr', en: 'en' };
  const targets = (['ar', 'fr', 'en'] as DetectedLang[]).filter(l => l !== sourceLang);
  
  const [nameT1, nameT2, descT1, descT2] = await Promise.all([
    translateText(name, langCodeMap[sourceLang], langCodeMap[targets[0]]),
    translateText(name, langCodeMap[sourceLang], langCodeMap[targets[1]]),
    translateText(description, langCodeMap[sourceLang], langCodeMap[targets[0]]),
    translateText(description, langCodeMap[sourceLang], langCodeMap[targets[1]]),
  ]);
  
  // Build all 3 versions
  const result: TranslationResult = {
    name_fr: name,
    name_ar: null,
    name_en: null,
    description_fr: description,
    description_ar: null,
    description_en: null,
  };
  
  if (sourceLang === 'ar') {
    result.name_ar = name;
    result.name_fr = nameT1 || name;   // targets[0] = fr (since ar removed → [fr, en])
    result.name_en = nameT2;           // targets[1] = en
    result.description_ar = description;
    result.description_fr = descT1 || description;
    result.description_en = descT2;
  } else if (sourceLang === 'fr') {
    result.name_fr = name;
    result.name_ar = nameT1;           // targets[0] = ar (since fr removed → [ar, en])
    result.name_en = nameT2;           // targets[1] = en
    result.description_fr = description;
    result.description_ar = descT1;
    result.description_en = descT2;
  } else {
    // English source
    result.name_en = name;
    result.name_fr = nameT2 || name;   // targets[0] = ar, targets[1] = fr
    result.name_ar = nameT1;           // targets[0] = ar
    result.description_en = description;
    result.description_fr = descT2 || description;
    result.description_ar = descT1;
  }
  
  return result;
}
