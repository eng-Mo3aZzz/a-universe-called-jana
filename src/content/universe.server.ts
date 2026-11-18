/**
 * ✦ ALL PERSONAL CONTENT LIVES HERE ✦
 *
 * Edit the texts, photos, songs and answers below. Everything in [brackets] is a
 * placeholder waiting for your own words. This file stays on the server and is only
 * sent to the browser after the right password is entered.
 *
 * Photos: put image files in /public/photos and write "/photos/name.jpg".
 * Songs / voice: put audio files in /public/audio and write "/audio/name.mp3".
 */
import type { UniverseContent, UniverseContentSource } from "./types";

const content: UniverseContentSource = {
  herName: "جنى",
  herNameEn: "Jana",
  partnerName: "[اسمك]",
  // Relationship start (Cairo time). The live counter counts from here.
  relationshipStart: "2025-08-23T00:00:00+03:00",

  welcome: {
    eyebrow: "النهارده يومك",
    title: "كل سنة وإنتي طيبة",
    message: "[اكتب رسالتك هنا — كلمة صغيرة ترحب بيها بجنى في عيد ميلادها]",
    wishPrompt: "غمّضي عينك، اتمني أمنية... وبعدين دوسي على الشمعة عشان تطفيها",
    wishDone: "أمنيتك طلعت للسما... وأنا متأكد إنها هتتحقق",
    startButton: "يلا نبدأ الرحلة",
  },

  timeline: {
    intro: "من يوم ٢٣ أغسطس ٢٠٢٥ والوقت بقى ليه طعم تاني... وده العداد شغال لحد دلوقتي",
    cards: [
      { id: "t1", date: "٢٣ أغسطس ٢٠٢٥", title: "أول كلام بينا", text: "[اكتب هنا عن أول كلام بينكم]", image: null, imageLabel: "[أضف الصورة هنا]" },
      { id: "t2", date: "[التاريخ]", title: "أول مرة اتقابلنا", text: "[اكتب هنا عن أول مقابلة]", image: null, imageLabel: "[أضف الصورة هنا]" },
      { id: "t3", date: "[التاريخ]", title: "اللحظة اللي عرفت فيها", text: "[اكتب هنا عن لحظة مهمة]", image: null, imageLabel: "[أضف الصورة هنا]" },
      { id: "t4", date: "[التاريخ]", title: "ذكرى مش هنساها", text: "[اكتب هنا عن ذكرى مميزة]", image: null, imageLabel: "[أضف الصورة هنا]" },
      { id: "t5", date: "[التاريخ]", title: "صورتنا المفضلة", text: "[اكتب هنا الحكاية ورا الصورة]", image: null, imageLabel: "[أضف الصورة هنا]" },
    ],
  },

  stars: {
    intro: "كل نجمة هنا شايلة حاجة صغيرة عشانك... دوسي عليهم واحدة واحدة",
    items: [
      { id: "s1", kind: "message", title: "رسالة مستخبية", text: "[اكتب رسالتك هنا]", image: null },
      { id: "s2", kind: "memory", title: "ذكرى", text: "[اكتب الذكرى هنا]", image: null },
      { id: "s3", kind: "photo", title: "صورة", text: "[اكتب تعليق على الصورة]", image: null },
      { id: "s4", kind: "note", title: "ملحوظة صغيرة", text: "[اكتب ملحوظتك هنا]", image: null },
      { id: "s5", kind: "message", title: "كلمة سر", text: "[اكتب رسالتك هنا]", image: null },
      { id: "s6", kind: "memory", title: "يوم حلو", text: "[اكتب الذكرى هنا]", image: null },
      { id: "s7", kind: "note", title: "حاجة عمري ما قولتهالك", text: "[اكتب هنا]", image: null },
    ],
  },

  play: {
    intro: "جاوبي بصراحة... وبعد كل إجابة هتلاقي ردي مستنيكي",
    questions: [
      {
        id: "q1",
        question: "لو هتوصفيني بكلمة واحدة، هتبقى إيه؟",
        options: [
          { label: "حنين", response: "[اكتب ردك لو اختارت «حنين»]" },
          { label: "مجنون", response: "[اكتب ردك لو اختارت «مجنون»]" },
          { label: "رخم بس بحبه", response: "[اكتب ردك لو اختارت «رخم بس بحبه»]" },
          { label: "كل ده مع بعض", response: "[اكتب ردك لو اختارت «كل ده مع بعض»]" },
        ],
      },
      {
        id: "q2",
        question: "إيه أكتر حاجة بتضحكك فيا؟",
        options: [
          { label: "هزاري البايخ", response: "[اكتب ردك هنا]" },
          { label: "وشي وأنا مركز", response: "[اكتب ردك هنا]" },
          { label: "لما بتحايل عليكي", response: "[اكتب ردك هنا]" },
        ],
      },
      {
        id: "q3",
        question: "لو أنا أكلة، هبقى إيه؟",
        options: [
          { label: "حاجة حلوة", response: "[اكتب ردك هنا]" },
          { label: "كشري... حاجة كده مليانة", response: "[اكتب ردك هنا]" },
          { label: "شطة", response: "[اكتب ردك هنا]" },
        ],
      },
      {
        id: "q4",
        question: "أنا بالنسبالك إيه بالظبط؟",
        options: [
          { label: "البيت", response: "[اكتب ردك هنا]" },
          { label: "صاحبي الأنتيم", response: "[اكتب ردك هنا]" },
          { label: "كل حاجة", response: "[اكتب ردك هنا]" },
        ],
      },
    ],
    statsTitle: "إحصائيات رسمية جداً",
    stats: [
      { label: "مستوى الدلع", kind: "percent", value: "100%", percent: 100 },
      { label: "احتمالية النوم في أي وقت", kind: "percent", value: "99%", percent: 99 },
      { label: "مستوى الغيرة", kind: "danger", value: "خطر!" },
      { label: "مرات طلعت عيني", kind: "counting", value: "جاري الحساب..." },
      { label: "«أنا مش زعلانة» وهي زعلانة", kind: "infinite", value: "∞" },
    ],
  },

  hunt: {
    intro: "في كنز مستخبي آخر الكوكب ده... كل إجابة صح بتفتح الدليل اللي بعده",
    steps: [
      {
        id: "h1",
        clue: "الدليل الأول مستخبي في كوكب الحكاية",
        question: "إيه أول كلمة في عنوان أول كارت هناك؟",
        hints: ["ارجعي لكوكب الحكاية وبصي على أول كارت", "الكلمة دي معناها «البداية»"],
        answers: ["أول"],
        success: "شاطرة! الدليل التاني جاي",
      },
      {
        id: "h2",
        clue: "الدليل التاني في سما الأسرار",
        question: "كام نجمة كانت مستخبية هناك؟",
        hints: ["عدّيهم كويس", "أكتر من ٦ وأقل من ٨"],
        answers: ["7", "سبعة", "سبعه", "سبع"],
        success: "عينك مفيش حاجة بتفوتها",
      },
      {
        id: "h3",
        clue: "الدليل التالت كان أول حاجة عملتيها هنا",
        question: "إيه الكلمة اللي فتحتي بيها باب الكون ده؟",
        hints: ["أول شاشة خالص", "اسم الدلع اللي بحبه"],
        answers: ["جوجتي"],
        success: "أكيد فاكراها... إزاي تنسيها أصلاً",
      },
      {
        id: "h4",
        clue: "[اكتب الدليل الأخير هنا]",
        question: "[اكتب السؤال الأخير هنا]",
        hints: ["[تلميح أول]", "[تلميح تاني]"],
        answers: ["بحبك"],
        success: "[اكتب رسالة الفوز هنا]",
      },
    ],
    finalMessage: "لقيتي الكنز! كوكب الهدايا اتفتح دلوقتي",
  },

  gifts: {
    intro: "خمس هدايا... كل واحدة بتفتح اللي بعدها",
    items: [
      { id: "g1", type: "letter", title: "جواب", teaser: "كلام مكتوب بإيدي", greeting: "[اكتب أول الجواب هنا]", body: "[اكتب رسالتك هنا]", signature: "[توقيعك]" },
      {
        id: "g2",
        type: "gallery",
        title: "ألبوم صورنا",
        teaser: "شوية لحظات حلوة",
        photos: [
          { image: null, caption: "[اكتب تعليق الصورة]" },
          { image: null, caption: "[اكتب تعليق الصورة]" },
          { image: null, caption: "[اكتب تعليق الصورة]" },
          { image: null, caption: "[اكتب تعليق الصورة]" },
        ],
      },
      { id: "g3", type: "music", title: "أغانينا", teaser: "الأغاني اللي بتفكرني بيكي", note: "[اكتب هنا ليه الأغاني دي بالذات]", tracks: [0, 1, 2] },
      {
        id: "g4",
        type: "memories",
        title: "مواقف تضحك",
        teaser: "دوسي على كل كارت يتقلب",
        cards: [
          { front: "[موقف مضحك ١]", back: "[اكتب التفاصيل هنا]" },
          { front: "[موقف مضحك ٢]", back: "[اكتب التفاصيل هنا]" },
          { front: "[موقف مضحك ٣]", back: "[اكتب التفاصيل هنا]" },
          { front: "[موقف مضحك ٤]", back: "[اكتب التفاصيل هنا]" },
        ],
      },
      { id: "g5", type: "surprise", title: "المفاجأة", teaser: "آخر هدية... وأحلاهم", heading: "[اكتب عنوان المفاجأة]", body: "[اكتب المفاجأة هنا]", image: null },
    ],
  },

  letters: {
    intro: "جوابين مقفولين... كل واحد ليه ميعاد يتفتح فيه",
    items: [
      { id: "l1", title: "لعيد ميلادك الجاي", forLabel: "يتفتح يوم ١٨ نوفمبر ٢٠٢٧", opensAt: "2027-11-18T00:00:00+02:00", greeting: "[أول الجواب]", body: "[اكتب رسالة عيد ميلادها الجاي هنا]", signature: "[توقيعك]" },
      { id: "l2", title: "لعيد حبنا الجاي", forLabel: "يتفتح يوم ٢٣ أغسطس ٢٠٢٧", opensAt: "2027-08-23T00:00:00+03:00", greeting: "[أول الجواب]", body: "[اكتب رسالة الذكرى الجاية هنا]", signature: "[توقيعك]" },
    ],
  },

  // Replace the placeholder tracks with your songs (files in /public/audio).
  playlist: [
    { title: "[أضف الأغنية هنا] ١", artist: "[اسم المطرب]", src: "/audio/placeholder-1.mp3" },
    { title: "[أضف الأغنية هنا] ٢", artist: "[اسم المطرب]", src: "/audio/placeholder-2.mp3" },
    { title: "[أضف الأغنية هنا] ٣", artist: "[اسم المطرب]", src: "/audio/placeholder-3.mp3" },
  ],

  finale: {
    lines: ["كل الكواكب دي...", "كل النجوم دي...", "كانت بتلف حوالين حاجة واحدة بس", "إنتي"],
    media: { type: "image", src: null, label: "[أضف الصورة أو الفيديو هنا]" },
    voice: { src: "/audio/voice-placeholder.mp3", label: "[أضف التسجيل الصوتي هنا]" },
    finalMessage: "[اكتب رسالتك الأخيرة هنا]",
    signature: "[توقيعك]",
  },

  secrets: [
    { id: "x1", text: "[سر صغير ١ — اكتب رسالتك هنا]" },
    { id: "x2", text: "[سر صغير ٢ — اكتب رسالتك هنا]" },
    { id: "x3", text: "[سر صغير ٣ — اكتب رسالتك هنا]" },
    { id: "x4", text: "[سر صغير ٤ — اكتب رسالتك هنا]" },
    { id: "x5", text: "[سر صغير ٥ — اكتب رسالتك هنا]" },
    { id: "x6", text: "[سر صغير ٦ — اكتب رسالتك هنا]" },
    { id: "x7", text: "[سر صغير ٧ — اكتب رسالتك هنا]" },
  ],
};

/** Sealed letters keep their words on the server until their date arrives. */
export function buildUniverseContent(now: Date): UniverseContent {
  return {
    ...content,
    letters: {
      ...content.letters,
      items: content.letters.items.map((l) => {
        const sealed = l.opensAt ? now.getTime() < new Date(l.opensAt).getTime() : false;
        return { ...l, sealed, greeting: sealed ? null : l.greeting, body: sealed ? null : l.body, signature: sealed ? null : l.signature };
      }),
    },
  };
}

