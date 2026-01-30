import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    login: {
      title: 'Disease Detection System',
      subtitle: 'Lightweight Edge AI Models for Disease Detection',
      description: 'Using Images and Clinical Reports: Case Studies on Conjunctivitis, Leishmaniasis, Dengue, and Acute Respiratory Infections',
      email: 'Email',
      password: 'Password',
      loginButton: 'Login',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember me',
      selectLanguage: 'Select Language'
    },
    languageSelection: {
      title: 'Select Your Preferred Language',
      subtitle: 'Choose a language to continue',
      english: 'English',
      sindhi: 'Sindhi',
      urdu: 'Urdu',
      continue: 'Continue'
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome to Disease Detection System',
      logout: 'Logout'
    },
    ageVerification: {
      title: 'Age Verification',
      question: 'Are you under 18 or above 18?',
      under18: 'Under 18',
      above18: 'Above 18',
      continue: 'Continue'
    },
    genderSelection: {
      title: 'Gender Selection',
      question: 'Please select your gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      preferNotToSay: 'Prefer not to say',
      continue: 'Continue'
    },
    cameraCapture: {
      title: 'Patient Photo Capture',
      instruction: 'Please position your face in the frame and click capture',
      capture: 'Capture Photo',
      retake: 'Retake',
      continue: 'Continue',
      loading: 'Loading camera...',
      error: 'Unable to access camera. Please check permissions.',
      noCamera: 'No camera found. Please connect a camera device.'
    },
    cnicCapture: {
      title: 'CNIC Verification',
      instruction: 'Please place your CNIC in front of the camera',
      capture: 'Capture CNIC',
      retake: 'Retake',
      continue: 'Continue',
      loading: 'Loading camera...',
      error: 'Unable to access camera. Please check permissions.',
      noCamera: 'No camera found. Please connect a camera device.'
    },
    phoneNumber: {
      title: 'Phone Number',
      instruction: 'Please enter your phone number',
      placeholder: '+92 - 3XXXXXXXXX',
      label: 'Phone Number',
      continue: 'Continue',
      error: 'Please enter a valid phone number',
      format: 'Format: +92 - 3XXXXXXXXX'
    },
    diseaseSelection: {
      title: 'Select Disease Type',
      instruction: 'Please select the type of problem you want to detect',
      eyes: 'Do you have Eyes Problem?',
      breathing: 'Do you have problem in breathing?',
      skin: 'Do you have problem related to skin?',
      dengue: 'Do you want to detect dengue?',
      continue: 'Continue'
    },
    breathingCapture: {
      title: 'Breathing Problem - Image Capture',
      xrayTitle: 'X-Ray Capture',
      xrayInstruction: 'Please place your X-ray in the camera frame',
      xrayCapture: 'Capture X-Ray',
      xrayViewer: 'X-Ray Viewer',
      stethoscopeTitle: 'Stethoscope Recording',
      stethoscopeInstruction: 'Place the stethoscope on your chest/lung area and cough',
      stethoscopeRecord: 'Start Recording',
      stethoscopeStop: 'Stop Recording',
      continue: 'Continue',
      retake: 'Retake'
    },
    eyesCapture: {
      title: 'Eyes Problem - Image Capture',
      instruction: 'Please close your eyes and we will capture the image',
      capture: 'Capture Image',
      continue: 'Continue',
      retake: 'Retake'
    },
    dengueCapture: {
      title: 'Dengue Detection - NS-1 Kit',
      instruction: 'Please place your NS-1 kit test result in the camera frame',
      capture: 'Capture NS-1 Kit Result',
      continue: 'Continue',
      retake: 'Retake',
      kitViewer: 'NS-1 Kit Viewer'
    },
    skinCapture: {
      title: 'Skin Problem - Image Capture',
      instruction: 'Please position the affected skin area in the camera frame',
      capture: 'Capture Affected Area',
      continue: 'Continue',
      retake: 'Retake',
      frameGuide: 'Position affected skin area here'
    },
    questionnaire: {
      title: 'Medical Questionnaire',
      question: 'Question',
      of: 'of',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit Answers',
      yes: 'Yes',
      no: 'No',
      sometimes: 'Sometimes',
      mild: 'Mild',
      moderate: 'Moderate',
      severe: 'Severe'
    },
    results: {
      title: 'Diagnosis Results',
      summary: 'Summary',
      recommendations: 'Recommendations',
      severity: 'Severity Level',
      backToHome: 'Back to Home',
      downloadReport: 'Download Report'
    }
  },
  sd: {
    login: {
      title: 'ڳولا سسٽم',
      subtitle: 'بيماري جي ڳولھه لاءِ لائٽ ويٽ ايڪج AI ماڊل',
      description: 'تصويرون ۽ ڪلينڪل رپورٽس استعمال ڪندي: ڪنڪٽيوٽائٽس، ليشمانياسس، ڊينگو، ۽ اڪيوٽ ريپيٽري انفيڪشنز تي ڪيس اسٽڊيز',
      email: 'اي ميل',
      password: 'پاسورڊ',
      loginButton: 'لاگ ان',
      emailPlaceholder: 'پنھنجي اي ميل داخل ڪريو',
      passwordPlaceholder: 'پنھنجو پاسورڊ داخل ڪريو',
      forgotPassword: 'پاسورڊ وساريو؟',
      rememberMe: 'مون کي ياد رکو',
      selectLanguage: 'ٻولي چونڊيو'
    },
    languageSelection: {
      title: 'پنھنجي پسنديده ٻولي چونڊيو',
      subtitle: 'جاري رکڻ لاءِ هڪ ٻولي چونڊيو',
      english: 'انگريزي',
      sindhi: 'سنڌي',
      urdu: 'اردو',
      continue: 'جاري رکو'
    },
    dashboard: {
      title: 'ڊيشن بورڊ',
      welcome: 'بيماري جي ڳولھه سسٽم ۾ خوش آمديد',
      logout: 'لاگ آؤٽ'
    },
    ageVerification: {
      title: 'عمر جي تصديق',
      question: 'ڇا توهان 18 سال کان هيٺ آهيو يا 18 سال کان مٿي؟',
      under18: '18 سال کان هيٺ',
      above18: '18 سال کان مٿي',
      continue: 'جاري رکو'
    },
    genderSelection: {
      title: 'جنس چونڊ',
      question: 'مهرباني ڪري پنھنجي جنس چونڊيو',
      male: 'مرد',
      female: 'عورت',
      other: 'ٻيو',
      preferNotToSay: 'چونڊ نه ڪري سگهان',
      continue: 'جاري رکو'
    },
    cameraCapture: {
      title: 'مريض جي تصوير کڻڻ',
      instruction: 'مهرباني ڪري پنھنجو چھري فریم ۾ رکو ۽ کپچر تي ڪلڪ ڪريو',
      capture: 'تصوير کڻو',
      retake: 'ٻيهر کڻو',
      continue: 'جاري رکو',
      loading: 'ڪئميرا لوڊ ٿي رهيو آهي...',
      error: 'ڪئميرا تائين رسائي حاصل نٿي ڪري سگهجي. مهرباني ڪري اجازتن جي چڪاس ڪريو.',
      noCamera: 'ڪوبه ڪئميرا نه مليو. مهرباني ڪري هڪ ڪئميرا ڊوائيس ڳنڍيو.'
    },
    cnicCapture: {
      title: 'CNIC تصديق',
      instruction: 'مهرباني ڪري پنھنجو CNIC ڪئميرا جي سامهون رکو',
      capture: 'CNIC کڻو',
      retake: 'ٻيهر کڻو',
      continue: 'جاري رکو',
      loading: 'ڪئميرا لوڊ ٿي رهيو آهي...',
      error: 'ڪئميرا تائين رسائي حاصل نٿي ڪري سگهجي. مهرباني ڪري اجازتن جي چڪاس ڪريو.',
      noCamera: 'ڪوبه ڪئميرا نه مليو. مهرباني ڪري هڪ ڪئميرا ڊوائيس ڳنڍيو.'
    },
    phoneNumber: {
      title: 'فون نمبر',
      instruction: 'مهرباني ڪري پنھنجو فون نمبر داخل ڪريو',
      placeholder: '+92 - 3XXXXXXXXX',
      label: 'فون نمبر',
      continue: 'جاري رکو',
      error: 'مهرباني ڪري صحيح فون نمبر داخل ڪريو',
      format: 'فارميٽ: +92 - 3XXXXXXXXX'
    },
    diseaseSelection: {
      title: 'بيماري جو قسم چونڊيو',
      instruction: 'مهرباني ڪري پنھنجي بيماري جو قسم چونڊيو',
      eyes: 'ڇا توهان کي اکين جي مسئلو آهي؟',
      breathing: 'ڇا توهان کي ساهه وٺڻ ۾ مسئلو آهي؟',
      skin: 'ڇا توهان کي چمڙي سان لاڳاپيل مسئلو آهي؟',
      dengue: 'ڇا توهان ڊينگو ڳولڻ چاهيو ٿا؟',
      continue: 'جاري رکو'
    },
    breathingCapture: {
      title: 'ساهه وٺڻ جو مسئلو - تصوير کڻڻ',
      xrayTitle: 'X-Ray کڻڻ',
      xrayInstruction: 'مهرباني ڪري پنھنجو X-Ray ڪئميرا فریم ۾ رکو',
      xrayCapture: 'X-Ray کڻو',
      xrayViewer: 'X-Ray ويوور',
      stethoscopeTitle: 'اسٿيٿوسڪوپ رڪارڊنگ',
      stethoscopeInstruction: 'اسٿيٿوسڪوپ کي پنھنجي چھاتي/پھپڙي واري علائقي ۾ رکو ۽ کھانسيو',
      stethoscopeRecord: 'رڪارڊنگ شروع ڪريو',
      stethoscopeStop: 'رڪارڊنگ بند ڪريو',
      continue: 'جاري رکو',
      retake: 'ٻيهر کڻو'
    },
    eyesCapture: {
      title: 'اکين جو مسئلو - تصوير کڻڻ',
      instruction: 'مهرباني ڪري پنھنجيون اکيون بند ڪريو ۽ اسين تصوير کڻنداسين',
      capture: 'تصوير کڻو',
      continue: 'جاري رکو',
      retake: 'ٻيهر کڻو'
    },
    dengueCapture: {
      title: 'ڊينگو ڳولھه - NS-1 ڪٽ',
      instruction: 'مهرباني ڪري پنھنجو NS-1 ڪٽ ٽيسٽ نتيجو ڪئميرا فریم ۾ رکو',
      capture: 'NS-1 ڪٽ نتيجو کڻو',
      continue: 'جاري رکو',
      retake: 'ٻيهر کڻو'
    },
    skinCapture: {
      title: 'چمڙي جو مسئلو - تصوير کڻڻ',
      instruction: 'مهرباني ڪري متاثر ٿيل چمڙي واري علائقي کي ڪئميرا فریم ۾ رکو',
      capture: 'متاثر ٿيل علائقو کڻو',
      continue: 'جاري رکو',
      retake: 'ٻيهر کڻو',
      frameGuide: 'متاثر ٿيل چمڙي واري علائقو هتي رکو'
    },
    questionnaire: {
      title: 'طبي سوالنامو',
      question: 'سوال',
      of: 'مان',
      next: 'اڳيون',
      previous: 'پوئين',
      submit: 'جواب جمع ڪريو',
      yes: 'ها',
      no: 'نه',
      sometimes: 'ڪڏهن ڪڏهن',
      mild: 'هلڪو',
      moderate: 'وچولو',
      severe: 'سخت'
    },
    results: {
      title: 'تشخيص جا نتيجا',
      summary: 'خلاصو',
      recommendations: 'سفارشون',
      severity: 'شدت جي سطح',
      backToHome: 'گهر واپس',
      downloadReport: 'رپورٽ ڊائون لوڊ ڪريو'
    }
  },
  ur: {
    login: {
      title: 'بیماری کیٛشن سسٹم',
      subtitle: 'بیماری کیٛشن کے لیے لائٹ ویٹ ایج AI ماڈلز',
      description: 'تصاویر اور کلینیکل رپورٹس کا استعمال: کنجیکٹیوائٹس، لیشمانیاسس، ڈینگی، اور ایکیوٹ ریسپائریٹری انفیکشنز پر کیس اسٹڈیز',
      email: 'ای میل',
      password: 'پاسورڈ',
      loginButton: 'لاگ ان',
      emailPlaceholder: 'اپنا ای میل درج کریں',
      passwordPlaceholder: 'اپنا پاسورڈ درج کریں',
      forgotPassword: 'پاسورڈ بھول گئے؟',
      rememberMe: 'مجھے یاد رکھیں',
      selectLanguage: 'زبان منتخب کریں'
    },
    languageSelection: {
      title: 'اپنی پسندیدہ زبان منتخب کریں',
      subtitle: 'جاری رکھنے کے لیے ایک زبان منتخب کریں',
      english: 'انگریزی',
      sindhi: 'سندھی',
      urdu: 'اردو',
      continue: 'جاری رکھیں'
    },
    dashboard: {
      title: 'ڈیش بورڈ',
      welcome: 'بیماری کیٛشن سسٹم میں خوش آمدید',
      logout: 'لاگ آؤٹ'
    },
    ageVerification: {
      title: 'عمر کی تصدیق',
      question: 'کیا آپ 18 سال سے کم ہیں یا 18 سال سے زیادہ؟',
      under18: '18 سال سے کم',
      above18: '18 سال سے زیادہ',
      continue: 'جاری رکھیں'
    },
    genderSelection: {
      title: 'جنس کا انتخاب',
      question: 'براہ کرم اپنی جنس منتخب کریں',
      male: 'مرد',
      female: 'عورت',
      other: 'دوسرا',
      preferNotToSay: 'کہنا پسند نہیں',
      continue: 'جاری رکھیں'
    },
    cameraCapture: {
      title: 'مریض کی تصویر لینا',
      instruction: 'براہ کرم اپنا چہرہ فریم میں رکھیں اور کیپچر پر کلک کریں',
      capture: 'تصویر لیں',
      retake: 'دوبارہ لیں',
      continue: 'جاری رکھیں',
      loading: 'کیمرہ لوڈ ہو رہا ہے...',
      error: 'کیمرہ تک رسائی حاصل نہیں ہو سکی۔ براہ کرم اجازتوں کی جانچ کریں۔',
      noCamera: 'کوئی کیمرہ نہیں ملا۔ براہ کرم ایک کیمرہ ڈیوائس منسلک کریں۔'
    },
    cnicCapture: {
      title: 'CNIC تصدیق',
      instruction: 'براہ کرم اپنا CNIC کیمرہ کے سامنے رکھیں',
      capture: 'CNIC لیں',
      retake: 'دوبارہ لیں',
      continue: 'جاری رکھیں',
      loading: 'کیمرہ لوڈ ہو رہا ہے...',
      error: 'کیمرہ تک رسائی حاصل نہیں ہو سکی۔ براہ کرم اجازتوں کی جانچ کریں۔',
      noCamera: 'کوئی کیمرہ نہیں ملا۔ براہ کرم ایک کیمرہ ڈیوائس منسلک کریں۔'
    },
    phoneNumber: {
      title: 'فون نمبر',
      instruction: 'براہ کرم اپنا فون نمبر درج کریں',
      placeholder: '+92 - 3XXXXXXXXX',
      label: 'فون نمبر',
      continue: 'جاری رکھیں',
      error: 'براہ کرم درست فون نمبر درج کریں',
      format: 'فارمیٹ: +92 - 3XXXXXXXXX'
    },
    diseaseSelection: {
      title: 'بیماری کا انتخاب',
      instruction: 'براہ کرم اپنی بیماری کی قسم منتخب کریں',
      eyes: 'کیا آپ کو آنکھوں کا مسئلہ ہے؟',
      breathing: 'کیا آپ کو سانس لینے میں مسئلہ ہے؟',
      skin: 'کیا آپ کو جلد سے متعلق مسئلہ ہے؟',
      dengue: 'کیا آپ ڈینگی کا پتہ لگانا چاہتے ہیں؟',
      continue: 'جاری رکھیں'
    },
    breathingCapture: {
      title: 'سانس لینے کا مسئلہ - تصویر لینا',
      xrayTitle: 'X-Ray کیپچر',
      xrayInstruction: 'براہ کرم اپنا X-Ray کیمرہ فریم میں رکھیں',
      xrayCapture: 'X-Ray لیں',
      xrayViewer: 'X-Ray ویوور',
      stethoscopeTitle: 'اسٹیتھوسکوپ ریکارڈنگ',
      stethoscopeInstruction: 'اسٹیتھوسکوپ کو اپنے سینے/پھیپھڑوں کے علاقے پر رکھیں اور کھانسیں',
      stethoscopeRecord: 'ریکارڈنگ شروع کریں',
      stethoscopeStop: 'ریکارڈنگ بند کریں',
      continue: 'جاری رکھیں',
      retake: 'دوبارہ لیں'
    },
    eyesCapture: {
      title: 'آنکھوں کا مسئلہ - تصویر لینا',
      instruction: 'براہ کرم اپنی آنکھیں بند کریں اور ہم تصویر لیں گے',
      capture: 'تصویر لیں',
      continue: 'جاری رکھیں',
      retake: 'دوبارہ لیں'
    },
    dengueCapture: {
      title: 'ڈینگی کی تشخیص - NS-1 کٹ',
      instruction: 'براہ کرم اپنا NS-1 کٹ ٹیسٹ نتیجہ کیمرہ فریم میں رکھیں',
      capture: 'NS-1 کٹ نتیجہ لیں',
      continue: 'جاری رکھیں',
      retake: 'دوبارہ لیں',
      kitViewer: 'NS-1 کٹ ویوور'
    },
    skinCapture: {
      title: 'جلد کا مسئلہ - تصویر لینا',
      instruction: 'براہ کرم متاثرہ جلد کے علاقے کو کیمرہ فریم میں رکھیں',
      capture: 'متاثرہ علاقہ لیں',
      continue: 'جاری رکھیں',
      retake: 'دوبارہ لیں',
      frameGuide: 'متاثرہ جلد کا علاقہ یہاں رکھیں'
    },
    questionnaire: {
      title: 'طبی سوالنامہ',
      question: 'سوال',
      of: 'میں سے',
      next: 'اگلا',
      previous: 'پچھلا',
      submit: 'جوابات جمع کریں',
      yes: 'ہاں',
      no: 'نہیں',
      sometimes: 'کبھی کبھی',
      mild: 'ہلکا',
      moderate: 'درمیانہ',
      severe: 'شدید'
    },
    results: {
      title: 'تشخیص کے نتائج',
      summary: 'خلاصہ',
      recommendations: 'توصیفات',
      severity: 'شدت کی سطح',
      backToHome: 'گھر واپس',
      downloadReport: 'رپورٹ ڈاؤن لوڈ کریں'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
      setSelectedLanguage(savedLang);
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setSelectedLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, selectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

