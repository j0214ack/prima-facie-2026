let currentLang = 'zh';
const listeners = [];

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  listeners.forEach(fn => fn(lang));
}

export function toggleLang() {
  setLang(currentLang === 'zh' ? 'en' : 'zh');
}

export function onLangChange(fn) {
  listeners.push(fn);
}

export function t(key) {
  return translations[currentLang][key] || translations.zh[key] || key;
}

// Get localized lawyer field, falling back to zh
export function tLawyer(lawyer, field) {
  if (currentLang === 'en' && lawyer[field + 'En']) return lawyer[field + 'En'];
  return lawyer[field];
}

const translations = {
  zh: {
    siteName: '律師辦公室裡的告解',
    langToggle: '繁體中文 / EN',
    selectLawyer: '選擇律師',
    close: '關閉',
    startChat: '開始聊聊 →',
    lawyerDisclaimer: '以上角色為虛構人物，語料來自真實律師訪談。',
    talkToLawyer: '跟律師聊聊 →',
    switchLawyer: '換律師聊',
    inputPlaceholder: '請輸入你的好奇...',
    send: '送出',
    disclaimer: '這是 AI 模擬對話情境，供教育用途，不構成法律建議。輸入內容會傳送至第三方 AI 服務進行分析與回應生成，請避免輸入個人資料或敏感資訊。',
    error: '發生錯誤：',
    welcomeText: '您可以選擇預設問題，或是由自己發問。<br/>與議題無關的話題將會被引導回正題。',
    noResponse: '（無回應）',
    heroTitle: '在性暴力的第一線，會看見什麼？',
    heroBody: `<p>
          在法庭，他們是代理人，將創傷「切割」成證據。<br/>
          在法袍下，他們是人，在制度與倫理的縫隙中掙扎。
          </p>
          <p>
          當法律無法解釋痛苦，當制度遺留了盲點，律師該如何消化那份沉重的情緒勞動？<br/>
          這裡整合了觀點迥異的法律靈魂的觀點，現在，歡迎選擇你的辯護人，開始你的詰問。
          </p>`,
    footerDisclaimer: '本系統對話內容由 AI 生成，語料來自真實律師訪談節錄。本展覽旨在提供社會思辨與對話空間，內容不構成任何法律諮詢與建議。若展覽內容觸動了您的創傷經驗，請優先照顧自己的情緒，並尋求專業心理師的陪伴。',
    footerCredits: '計畫主持 ｜ 李紫彤&emsp;主辦單位 ｜ 財團法人民間司法改革基金會・微米宇宙演藝團體<br/>聯絡信箱 ｜ l.tzutung@gmail.com&emsp;© 2026 版權所有',
    introTitle: '歡迎來到虛擬的<br class="mobile-br" />「律師辦公室」',
    introText: `<p>「Prima Facie」直譯為「原本以為」，在法律上則指「乍看之下即成立的證據」。</p>
            <p>然而，在權勢關係與性暴力的情境中，創傷真的能被「證據」完整呈現嗎？「原本以為」往往成為所有創傷敘事的起點：</p>
            <p>「原本以為，他是好人。」<br/>「原本以為，可法應還給我正義。」<br/>「原本以為，只要把創傷翻譯成法律代價，痛苦就會終止。」</p>
            <p>在這個 AI 對話空間中，我們整合了多位律師、觀點迥異的訪談節錄。<br/>在這裡，法律不再只是冰冷條文，而是一套交織著個人經驗、詮釋與父權盲點的系統。<br/>你可以與不同的「律師」展開對話，模擬身在性平衝突第一線的律師們的經驗與各種立場。</p>`,
  },
  en: {
    siteName: 'Confessions in a Lawyer\'s Office',
    langToggle: '繁體中文 / EN',
    selectLawyer: 'Select Lawyer',
    close: 'Close',
    startChat: 'Start Chat →',
    lawyerDisclaimer: 'The characters above are fictional, based on real lawyer interviews.',
    talkToLawyer: 'Talk to a Lawyer →',
    switchLawyer: 'Switch Lawyer',
    inputPlaceholder: 'Type your question...',
    send: 'Send',
    disclaimer: 'This is an AI-simulated conversation for educational purposes and does not constitute legal advice. Your input is sent to a third-party AI service for analysis and response generation. Please avoid entering personal data or sensitive information.',
    error: 'Error: ',
    welcomeText: 'You may choose a suggested question or ask your own.<br/>Off-topic questions will be redirected back to the subject.',
    noResponse: '(No response)',
    heroTitle: 'What do you see on the front lines of sexual violence?',
    heroBody: `<p>
          In court, they are representatives, dissecting trauma into "evidence."<br/>
          Beneath the robe, they are human, struggling in the cracks between the system and ethics.
          </p>
          <p>
          When the law cannot explain suffering, when the system leaves blind spots, how do lawyers process that heavy emotional labor?<br/>
          Here we bring together diverse legal perspectives. Now, choose your advocate and begin your cross-examination.
          </p>`,
    footerDisclaimer: 'The content of this system is AI-generated, based on excerpts from real lawyer interviews. This exhibition aims to provide a space for social reflection and dialogue, and does not constitute any legal consultation or advice. If the exhibition content triggers traumatic experiences, please take care of your emotions first and seek professional psychological support.',
    footerCredits: 'Project Lead ｜ Lee Tzu-Tung&emsp;Organizers ｜ Judicial Reform Foundation・Micro Universe Performance Group<br/>Contact ｜ l.tzutung@gmail.com&emsp;© 2026 All Rights Reserved',
    introTitle: 'Welcome to the Virtual<br class="mobile-br" />"Lawyer\'s Office"',
    introText: `<p>"Prima Facie" literally translates to "at first glance," and in legal terms refers to "evidence that is sufficient on its face."</p>
            <p>But in contexts of power dynamics and sexual violence, can trauma truly be fully captured by "evidence"? "I thought..." often becomes the starting point of every trauma narrative:</p>
            <p>"I thought he was a good person."<br/>"I thought the law would give me justice."<br/>"I thought that by translating trauma into legal consequences, the pain would end."</p>
            <p>In this AI conversation space, we have integrated interview excerpts from multiple lawyers with diverse perspectives.<br/>Here, the law is no longer just cold statutes, but a system intertwined with personal experience, interpretation, and patriarchal blind spots.<br/>You can engage in dialogue with different "lawyers," simulating the experiences and positions of lawyers on the front lines of gender equity conflicts.</p>`,
  },
};
