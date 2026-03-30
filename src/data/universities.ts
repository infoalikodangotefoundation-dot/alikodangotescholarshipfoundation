export interface UniversityProgram {
  category: string;
  courses: string[];
}

export interface University {
  id: string;
  name: string;
  location: string;
  countryCode: string;
  image: string;
  bannerImage: string;
  overview: string;
  reputation: string;
  programs: UniversityProgram[];
  durations: {
    undergraduate: string;
    masters: string;
    phd: string;
  };
  teachingStyle: string;
  researchOpportunities: string;
  facilities: string;
  advantages: string[];
  careerOpportunities: string;
  ranking: string;
}

export const universities: University[] = [
  {
    id: "cambridge",
    name: "University of Cambridge",
    location: "Cambridge, United Kingdom",
    countryCode: "gb",
    image: "https://images.openai.com/static-rsc-4/n80lkuuYAvss7aO84Ieg4UGwYOdRiI6tGXTsqrN2nKJMwNMMOUp6qrNIMqBppv3UCyJzhKblcZMHSLrdRj0E5kSF0_dW3o-CtNlrz5ZilCLpN6Br1ZT33nUCKpymZTXcAJYxpYwVeWDRk7Xeo-o4irjAO5t-0qTv9K9GNRZ_IkaVjAJG28VQ8Y-orrhCua93?purpose=fullsize",
    bannerImage: "https://images.openai.com/static-rsc-4/n80lkuuYAvss7aO84Ieg4UGwYOdRiI6tGXTsqrN2nKJMwNMMOUp6qrNIMqBppv3UCyJzhKblcZMHSLrdRj0E5kSF0_dW3o-CtNlrz5ZilCLpN6Br1ZT33nUCKpymZTXcAJYxpYwVeWDRk7Xeo-o4irjAO5t-0qTv9K9GNRZ_IkaVjAJG28VQ8Y-orrhCua93?purpose=fullsize",
    overview: "The University of Cambridge is one of the world's oldest and most prestigious universities. Founded in 1209, it has a rich history of academic excellence and scientific discovery.",
    reputation: "Consistently ranked among the top 5 universities globally, Cambridge is renowned for its rigorous academic standards and world-leading research across all disciplines.",
    programs: [
      { category: "Engineering", courses: ["Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Aerospace Engineering"] },
      { category: "Computer Science & AI", courses: ["Computer Science", "Artificial Intelligence", "Machine Learning"] },
      { category: "Medicine & Health Sciences", courses: ["Medicine", "Veterinary Medicine", "Biomedical Sciences"] },
      { category: "Business & Management", courses: ["Management Studies", "Finance", "Economics"] },
      { category: "Law", courses: ["Law (LL.B)", "International Law", "Criminology"] },
      { category: "Natural Sciences", courses: ["Physics", "Chemistry", "Biology", "Mathematics"] }
    ],
    durations: { undergraduate: "3–4 years", masters: "1–2 years", phd: "3–5 years" },
    teachingStyle: "The unique supervision system provides students with personalized attention from world-leading experts in small group settings.",
    researchOpportunities: "Cambridge is a global hub for research, with numerous institutes and laboratories pushing the boundaries of human knowledge.",
    facilities: "State-of-the-art libraries, laboratories, and historic colleges provide an unparalleled environment for study and research.",
    advantages: ["World-class faculty", "Global alumni network", "Historic academic environment", "Rich cultural heritage"],
    careerOpportunities: "Graduates are highly sought after by top employers worldwide, with many becoming leaders in their fields.",
    ranking: "Ranked #2 in the QS World University Rankings 2024."
  },
  {
    id: "harvard",
    name: "Harvard University",
    location: "Cambridge, Massachusetts, USA",
    countryCode: "us",
    image: "https://images.openai.com/static-rsc-4/FvjaRqc40E8mvWeVzWCBpfafYeu6oBqjOOtmTfN3oTShxcHrJitmjn4VjvQ3YxrwKKGiRwooErH8nFO1LIX6zDiMEZlaBcZuArGE0gXbnQ5rOFcuHBk4XFhF99swEf28ozEs2t42voowzNnM7z9u_0KqoAV28joWvVqUizaXbAY_ey0kvPnIcIrcJz-Bip20?purpose=fullsize",
    bannerImage: "https://images.openai.com/static-rsc-4/FvjaRqc40E8mvWeVzWCBpfafYeu6oBqjOOtmTfN3oTShxcHrJitmjn4VjvQ3YxrwKKGiRwooErH8nFO1LIX6zDiMEZlaBcZuArGE0gXbnQ5rOFcuHBk4XFhF99swEf28ozEs2t42voowzNnM7z9u_0KqoAV28joWvVqUizaXbAY_ey0kvPnIcIrcJz-Bip20?purpose=fullsize",
    overview: "Harvard University is the oldest institution of higher learning in the United States. Established in 1636, it is a leading Ivy League research university with a global reputation.",
    reputation: "Harvard is synonymous with academic prestige and influence, producing numerous Nobel laureates, heads of state, and global leaders.",
    programs: [
      { category: "Business & Management", courses: ["MBA", "Economics", "Finance", "Public Policy"] },
      { category: "Law", courses: ["Law (J.D.)", "International Legal Studies", "Constitutional Law"] },
      { category: "Medicine & Health Sciences", courses: ["Medicine", "Public Health", "Dental Medicine"] },
      { category: "Computer Science & AI", courses: ["Computer Science", "Data Science", "Computational Science"] },
      { category: "Social Sciences", courses: ["Sociology", "Psychology", "Political Science", "History"] },
      { category: "Arts & Humanities", courses: ["English Literature", "Philosophy", "History of Art"] }
    ],
    durations: { undergraduate: "4 years", masters: "1–2 years", phd: "4–6 years" },
    teachingStyle: "A combination of case-study methods, lectures, and hands-on research opportunities led by distinguished faculty.",
    researchOpportunities: "Harvard hosts over 100 research centers and institutes, providing students with vast opportunities for interdisciplinary research.",
    facilities: "The Harvard Library system is the largest academic library in the world, complemented by world-class research labs and museums.",
    advantages: ["Unmatched prestige", "Global network of influence", "Extensive research funding", "Diverse student body"],
    careerOpportunities: "Harvard graduates have access to the world's most exclusive career opportunities and a lifelong professional network.",
    ranking: "Ranked #4 in the QS World University Rankings 2024."
  },
  {
    id: "oxford",
    name: "University of Oxford",
    location: "Oxford, United Kingdom",
    countryCode: "gb",
    image: "https://images.openai.com/static-rsc-4/E8KlyxR6QoKaCs5nvtZkUdAM7Tf7IydoBDjj3eF716jQwnvuHzxsfYJXLcDVtiuQB-I759Y8DnzeqwwyXH0_N09Qdmov_7v-OHW4AT4ME1Cp_iNPNe8Ms4ExujSkHIivEhCokcqB3hCE6Y-eBvZ4n5xjhRKKXutCUgwTLhjlmqjdlc6h-H8Dzht295atMLEW?purpose=fullsize",
    bannerImage: "https://images.openai.com/static-rsc-4/E8KlyxR6QoKaCs5nvtZkUdAM7Tf7IydoBDjj3eF716jQwnvuHzxsfYJXLcDVtiuQB-I759Y8DnzeqwwyXH0_N09Qdmov_7v-OHW4AT4ME1Cp_iNPNe8Ms4ExujSkHIivEhCokcqB3hCE6Y-eBvZ4n5xjhRKKXutCUgwTLhjlmqjdlc6h-H8Dzht295atMLEW?purpose=fullsize",
    overview: "The University of Oxford is the oldest university in the English-speaking world. It is a unique and historic institution that remains at the forefront of global education.",
    reputation: "Oxford is world-famous for its academic excellence, research impact, and the unique collegiate system that fosters a close-knit academic community.",
    programs: [
      { category: "Law", courses: ["Jurisprudence", "International Law", "Legal Philosophy"] },
      { category: "Medicine & Health Sciences", courses: ["Medicine", "Biomedical Sciences", "Experimental Psychology"] },
      { category: "Natural Sciences", courses: ["Physics", "Chemistry", "Biology", "Earth Sciences"] },
      { category: "Computer Science & AI", courses: ["Computer Science", "Artificial Intelligence", "Software Engineering"] },
      { category: "Social Sciences", courses: ["Economics", "Politics", "Philosophy", "International Relations"] },
      { category: "Arts & Humanities", courses: ["History", "English Language and Literature", "Classics"] }
    ],
    durations: { undergraduate: "3–4 years", masters: "1–2 years", phd: "3–4 years" },
    teachingStyle: "The tutorial system is the core of Oxford's teaching, offering students personalized, one-on-one or small group academic sessions.",
    researchOpportunities: "Oxford is a global leader in research, particularly in the sciences, humanities, and social sciences.",
    facilities: "Historic libraries like the Bodleian, modern research laboratories, and beautiful college campuses provide an inspiring environment.",
    advantages: ["Centuries of tradition", "World-leading research", "Personalized tutorial system", "Global academic prestige"],
    careerOpportunities: "Oxford graduates are highly valued for their critical thinking and analytical skills, securing top roles in all sectors.",
    ranking: "Ranked #3 in the QS World University Rankings 2024."
  },
  {
    id: "stanford",
    name: "Stanford University",
    location: "Stanford, California, USA",
    countryCode: "us",
    image: "https://images.openai.com/static-rsc-4/Ex6g-tzKtjRP3kYFMiAsigJQTuKDJU5BNgl1kVt0vQoYaEsk7f0tglaOp-U0mfyGWA4BxiSmg12o5jNpfYV5TDx3sthJyjo_v9CVzte_BfjbI1lrcD9SgR79N0SEB_HakN3gg0TPqkSke1xRrBrpcM49T0vOBcuRxIGX9Z9VQnv5G3NFLBtOuqpL3k4FymBj?purpose=fullsize",
    bannerImage: "https://images.openai.com/static-rsc-4/Ex6g-tzKtjRP3kYFMiAsigJQTuKDJU5BNgl1kVt0vQoYaEsk7f0tglaOp-U0mfyGWA4BxiSmg12o5jNpfYV5TDx3sthJyjo_v9CVzte_BfjbI1lrcD9SgR79N0SEB_HakN3gg0TPqkSke1xRrBrpcM49T0vOBcuRxIGX9Z9VQnv5G3NFLBtOuqpL3k4FymBj?purpose=fullsize",
    overview: "Stanford University is a hub for innovation and entrepreneurship, located in the heart of Silicon Valley. It is one of the world's leading research and teaching institutions.",
    reputation: "Stanford is renowned for its entrepreneurial spirit, close ties to the tech industry, and groundbreaking research in science and engineering.",
    programs: [
      { category: "Computer Science & AI", courses: ["Computer Science", "Artificial Intelligence", "Human-Computer Interaction"] },
      { category: "Engineering", courses: ["Electrical Engineering", "Mechanical Engineering", "Bioengineering"] },
      { category: "Business & Management", courses: ["MBA", "Management Science", "Finance"] },
      { category: "Medicine & Health Sciences", courses: ["Medicine", "Biosciences", "Health Policy"] },
      { category: "Law", courses: ["Law (J.D.)", "Legal Studies", "Intellectual Property Law"] },
      { category: "Natural Sciences", courses: ["Physics", "Applied Physics", "Chemistry"] }
    ],
    durations: { undergraduate: "4 years", masters: "1–2 years", phd: "4–6 years" },
    teachingStyle: "An emphasis on interdisciplinary collaboration, innovation, and practical application of knowledge.",
    researchOpportunities: "Stanford's research ecosystem is vast, with numerous labs and centers focused on solving global challenges.",
    facilities: "Cutting-edge research facilities, a sprawling campus, and proximity to Silicon Valley's tech giants.",
    advantages: ["Innovation mindset", "Silicon Valley connections", "Top-tier research funding", "Entrepreneurial culture"],
    careerOpportunities: "Stanford graduates are at the forefront of the tech industry, often founding successful startups or joining global tech leaders.",
    ranking: "Ranked #5 in the QS World University Rankings 2024."
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    location: "Cambridge, Massachusetts, USA",
    countryCode: "us",
    image: "https://images.openai.com/static-rsc-4/aeleXATJcGyVC4GMQmbqsBd1N9umL2PsvxgJqvDWzshs-JgQzeOHO7W2GGoyppOa7PPIHgKY8rf9ATGLI_VkndvqJMsCCQVZZSJKvC03bO_RiNjYJed9ciePqcio0Cte32LiFff8I_d3x2eMH2D_RVhkwX98L7MDdOUhAFnTXUVoMIP99T-UXpNRN5qYv_Qk?purpose=fullsize",
    bannerImage: "https://images.openai.com/static-rsc-4/aeleXATJcGyVC4GMQmbqsBd1N9umL2PsvxgJqvDWzshs-JgQzeOHO7W2GGoyppOa7PPIHgKY8rf9ATGLI_VkndvqJMsCCQVZZSJKvC03bO_RiNjYJed9ciePqcio0Cte32LiFff8I_d3x2eMH2D_RVhkwX98L7MDdOUhAFnTXUVoMIP99T-UXpNRN5qYv_Qk?purpose=fullsize",
    overview: "MIT is a world-renowned research university known for its focus on science, technology, and engineering. It is a global leader in innovation and technical education.",
    reputation: "MIT is consistently ranked as the #1 university in the world, known for its rigorous academic programs and pioneering research.",
    programs: [
      { category: "Engineering", courses: ["Mechanical Engineering", "Electrical Engineering", "Chemical Engineering", "Aerospace Engineering"] },
      { category: "Computer Science & AI", courses: ["Computer Science", "Artificial Intelligence", "Robotics"] },
      { category: "Natural Sciences", courses: ["Physics", "Mathematics", "Chemistry", "Biology"] },
      { category: "Business & Management", courses: ["Management", "Finance", "Business Analytics"] },
      { category: "Social Sciences", courses: ["Economics", "Linguistics", "Political Science"] },
      { category: "Arts & Humanities", courses: ["Architecture", "Media Arts and Sciences"] }
    ],
    durations: { undergraduate: "4 years", masters: "1–2 years", phd: "4–6 years" },
    teachingStyle: "A 'hands-on' approach to learning, emphasizing problem-solving, experimentation, and technical mastery.",
    researchOpportunities: "MIT is a powerhouse of research, with students involved in groundbreaking projects from their first year.",
    facilities: "World-class laboratories, maker spaces, and specialized research centers like the MIT Media Lab.",
    advantages: ["Global leadership in STEM", "Intense academic rigor", "Pioneering research culture", "Strong industry partnerships"],
    careerOpportunities: "MIT graduates are highly sought after by top engineering, tech, and financial firms worldwide.",
    ranking: "Ranked #1 in the QS World University Rankings 2024."
  },
  {
    id: "toronto",
    name: "University of Toronto",
    location: "Toronto, Canada",
    countryCode: "ca",
    image: "https://images.openai.com/static-rsc-4/UiSpBJB5Zil3auWvmFV9__lKSoUKVKpTtSJQmKzwl2gS6wedrgQm4K6aZGSgYbmETya9juxhFj8ctNfUqVxgvXxRlAW-gC_GmjNm3pWR0eQ842_-IXf4zP0grR9tFMHTCjRbISOc1JFYV6eaT1JVVz4s287uNA_omW3SmpZkqoJB-Y8DaeRdIzk_XJOtZX_P?purpose=fullsize",
    bannerImage: "https://images.openai.com/static-rsc-4/UiSpBJB5Zil3auWvmFV9__lKSoUKVKpTtSJQmKzwl2gS6wedrgQm4K6aZGSgYbmETya9juxhFj8ctNfUqVxgvXxRlAW-gC_GmjNm3pWR0eQ842_-IXf4zP0grR9tFMHTCjRbISOc1JFYV6eaT1JVVz4s287uNA_omW3SmpZkqoJB-Y8DaeRdIzk_XJOtZX_P?purpose=fullsize",
    overview: "The University of Toronto is Canada's leading research university. It is a global leader in higher education and research, with a diverse and vibrant academic community.",
    reputation: "U of T is known for its research excellence, particularly in medicine, computer science, and the humanities.",
    programs: [
      { category: "Engineering", courses: ["Civil Engineering", "Mechanical Engineering", "Computer Engineering"] },
      { category: "Computer Science & AI", courses: ["Computer Science", "Artificial Intelligence", "Data Science"] },
      { category: "Medicine & Health Sciences", courses: ["Medicine", "Nursing", "Pharmacy", "Public Health"] },
      { category: "Business & Management", courses: ["Commerce", "Management", "Economics"] },
      { category: "Law", courses: ["Law (JD)", "International Law"] },
      { category: "Natural Sciences", courses: ["Physics", "Chemistry", "Mathematics"] }
    ],
    durations: { undergraduate: "4 years", masters: "1–2 years", phd: "4–6 years" },
    teachingStyle: "A blend of traditional lectures, seminars, and extensive research opportunities in a multicultural environment.",
    researchOpportunities: "U of T is a research powerhouse, with one of the largest research budgets in North America.",
    facilities: "Modern research labs, extensive library systems, and a beautiful urban campus in the heart of Toronto.",
    advantages: ["Top-ranked in Canada", "Diverse and inclusive", "Global research impact", "Vibrant city life"],
    careerOpportunities: "Graduates benefit from Toronto's status as a global financial and tech hub, with strong employment prospects.",
    ranking: "Ranked #21 in the QS World University Rankings 2024."
  },
  {
    id: "melbourne",
    name: "University of Melbourne",
    location: "Melbourne, Australia",
    countryCode: "au",
    image: "https://images.openai.com/static-rsc-4/epb_zszbnTxVEoCiToP7nm-98NilYg__0ZcrEFYiat1iSi_4HWgWv-bXlRmB2iWSoFCIWXHUBNEljyskEcc1PfAAvweSPBSH4hmYwoFTV4-d13-dg-ybW8sXIbAJxTMH6ALWZaMTrJ94HkpCpgWx5I0O_lnrkXVwiloHZXHysGlw9QTckQL3qI9Q0qinjP4U?purpose=fullsize",
    bannerImage: "https://images.openai.com/static-rsc-4/epb_zszbnTxVEoCiToP7nm-98NilYg__0ZcrEFYiat1iSi_4HWgWv-bXlRmB2iWSoFCIWXHUBNEljyskEcc1PfAAvweSPBSH4hmYwoFTV4-d13-dg-ybW8sXIbAJxTMH6ALWZaMTrJ94HkpCpgWx5I0O_lnrkXVwiloHZXHysGlw9QTckQL3qI9Q0qinjP4U?purpose=fullsize",
    overview: "The University of Melbourne is Australia's leading university, known for its research excellence and vibrant campus life in the heart of Melbourne.",
    reputation: "Melbourne is consistently ranked as the top university in Australia and is renowned for its high academic standards and global research impact.",
    programs: [
      { category: "Medicine & Health Sciences", courses: ["Medicine", "Biomedical Science", "Public Health"] },
      { category: "Law", courses: ["Juris Doctor (JD)", "International Law"] },
      { category: "Engineering", courses: ["Civil Engineering", "Mechanical Engineering", "Software Engineering"] },
      { category: "Business & Management", courses: ["Commerce", "Management", "Economics"] },
      { category: "Natural Sciences", courses: ["Physics", "Chemistry", "Biology"] },
      { category: "Arts & Humanities", courses: ["Arts", "Music", "Fine Arts"] }
    ],
    durations: { undergraduate: "3 years", masters: "1.5–2 years", phd: "3–4 years" },
    teachingStyle: "The 'Melbourne Model' offers a unique curriculum that emphasizes broad undergraduate study followed by professional specialization.",
    researchOpportunities: "A leading research institution with numerous centers focused on global health, sustainability, and technology.",
    facilities: "Historic and modern buildings, state-of-the-art labs, and extensive student support services.",
    advantages: ["Top-ranked in Australia", "Unique curriculum model", "Global research network", "Beautiful campus"],
    careerOpportunities: "Graduates are highly employable, with strong connections to industry and professional networks in Australia and beyond.",
    ranking: "Ranked #14 in the QS World University Rankings 2024."
  },
  {
    id: "tsinghua",
    name: "Tsinghua University",
    location: "Beijing, China",
    countryCode: "cn",
    image: "https://images.openai.com/static-rsc-4/FAE6D7v9NPZ_9X4bv-GsvfYyeT5unxzg490wHszcKnFDI7XwK0s2S7pdizCtPT8Wje5ca01irtVz0vnX7FfaIbfPMGT3ne2PyKE3ZpoXzop0DWbTuYxUWh_KdN1FBSUkgoTHYbmhe2cr9z16uxTqvFgbmpSq-LPUQQKKQv7U6QQWAWQMG5NIPer99WHPOiQz?purpose=fullsize",
    bannerImage: "https://images.openai.com/static-rsc-4/FAE6D7v9NPZ_9X4bv-GsvfYyeT5unxzg490wHszcKnFDI7XwK0s2S7pdizCtPT8Wje5ca01irtVz0vnX7FfaIbfPMGT3ne2PyKE3ZpoXzop0DWbTuYxUWh_KdN1FBSUkgoTHYbmhe2cr9z16uxTqvFgbmpSq-LPUQQKKQv7U6QQWAWQMG5NIPer99WHPOiQz?purpose=fullsize",
    overview: "Tsinghua University is one of China's most prestigious universities, often referred to as the 'MIT of China'. It is a leading center for engineering and technology.",
    reputation: "Tsinghua is renowned for its academic excellence, particularly in STEM fields, and its role in shaping China's technological and economic future.",
    programs: [
      { category: "Engineering", courses: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Chemical Engineering"] },
      { category: "Computer Science & AI", courses: ["Computer Science", "Artificial Intelligence", "Data Science"] },
      { category: "Natural Sciences", courses: ["Physics", "Mathematics", "Chemistry"] },
      { category: "Business & Management", courses: ["Economics", "Management", "Finance"] },
      { category: "Medicine & Health Sciences", courses: ["Medicine", "Biomedical Engineering"] },
      { category: "Social Sciences", courses: ["Public Policy", "International Relations"] }
    ],
    durations: { undergraduate: "4 years", masters: "2–3 years", phd: "3–5 years" },
    teachingStyle: "A rigorous academic environment with a strong emphasis on research, innovation, and national development.",
    researchOpportunities: "Tsinghua is a global leader in research, with numerous state key laboratories and research institutes.",
    facilities: "Modern research facilities, a beautiful historic campus, and extensive digital resources.",
    advantages: ["Top-ranked in China", "Global leadership in Engineering", "Strong government and industry ties", "Elite academic community"],
    careerOpportunities: "Graduates are highly sought after by top Chinese and international firms, as well as government agencies.",
    ranking: "Ranked #25 in the QS World University Rankings 2024."
  },
  {
    id: "peking",
    name: "Peking University",
    location: "Beijing, China",
    countryCode: "cn",
    image: "https://techportal.in/wp-content/uploads/2023/10/peking-university-1695573947-768x432.jpg",
    bannerImage: "https://techportal.in/wp-content/uploads/2023/10/peking-university-1695573947-768x432.jpg",
    overview: "Peking University is a major research university in Beijing and a member of the C9 League of elite Chinese universities. It is known for its academic excellence in the humanities and social sciences.",
    reputation: "Peking University is one of the most prestigious universities in Asia, renowned for its intellectual freedom and contributions to modern Chinese history.",
    programs: [
      { category: "Social Sciences", courses: ["Economics", "Political Science", "Sociology", "International Relations"] },
      { category: "Arts & Humanities", courses: ["Chinese Literature", "History", "Philosophy"] },
      { category: "Natural Sciences", courses: ["Mathematics", "Physics", "Chemistry", "Biology"] },
      { category: "Medicine & Health Sciences", courses: ["Medicine", "Public Health", "Pharmacy"] },
      { category: "Law", courses: ["Law", "International Law"] },
      { category: "Computer Science & AI", courses: ["Computer Science", "Information Science"] }
    ],
    durations: { undergraduate: "4 years", masters: "2–3 years", phd: "3–5 years" },
    teachingStyle: "An emphasis on critical thinking, intellectual exploration, and a broad-based education in the liberal arts and sciences.",
    researchOpportunities: "A leading center for research in the humanities, social sciences, and natural sciences in China.",
    facilities: "Historic campus (Yan園), extensive library collections, and modern research centers.",
    advantages: ["Intellectual prestige", "Beautiful historic campus", "Diverse academic programs", "Strong alumni network"],
    careerOpportunities: "Graduates excel in academia, government, and the private sector, both in China and internationally.",
    ranking: "Ranked #17 in the QS World University Rankings 2024."
  },
  {
    id: "zhejiang",
    name: "Zhejiang University",
    location: "Hangzhou, China",
    countryCode: "cn",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqPaX775Xl7pBbSEacBZIhjH_hp2VXWs9t_n8Db_OqSliWvIM2xHzLAvRkzk5rXyuPQKVtKsiaVe_I30Be_PFvP8SCQgoPaz5FlJRQH_QUmX15e0zzr4TMwXbYDc5hIi7wsvuw=s680-w680-h510-rw",
    bannerImage: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqPaX775Xl7pBbSEacBZIhjH_hp2VXWs9t_n8Db_OqSliWvIM2xHzLAvRkzk5rXyuPQKVtKsiaVe_I30Be_PFvP8SCQgoPaz5FlJRQH_QUmX15e0zzr4TMwXbYDc5hIi7wsvuw=s680-w680-h510-rw",
    overview: "Zhejiang University is one of China's oldest and most prestigious institutions of higher education. Located in the beautiful city of Hangzhou, it is a comprehensive research university.",
    reputation: "Zhejiang University is known for its strong research performance, particularly in engineering, agriculture, and computer science.",
    programs: [
      { category: "Engineering", courses: ["Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Materials Science"] },
      { category: "Computer Science & AI", courses: ["Computer Science", "Artificial Intelligence", "Information Technology"] },
      { category: "Natural Sciences", courses: ["Mathematics", "Physics", "Chemistry", "Biology"] },
      { category: "Medicine & Health Sciences", courses: ["Medicine", "Pharmacy", "Public Health"] },
      { category: "Business & Management", courses: ["Management", "Economics", "Finance"] },
      { category: "Arts & Humanities", courses: ["Chinese Language and Literature", "History"] }
    ],
    durations: { undergraduate: "4 years", masters: "2–3 years", phd: "3–5 years" },
    teachingStyle: "A focus on innovation, entrepreneurship, and interdisciplinary research in a modern academic setting.",
    researchOpportunities: "A top research university in China with significant contributions to science and technology.",
    facilities: "Multiple modern campuses, advanced research labs, and extensive student facilities.",
    advantages: ["Strong research focus", "Beautiful Hangzhou location", "Diverse academic disciplines", "Innovative culture"],
    careerOpportunities: "Graduates are well-positioned for careers in China's rapidly growing tech and industrial sectors.",
    ranking: "Ranked #44 in the QS World University Rankings 2024."
  },
  {
    id: "eth-zurich",
    name: "ETH Zurich",
    location: "Zurich, Switzerland",
    countryCode: "ch",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwermvNIOLHXH1zxR3srWwXt3osBqzpLf19RMmOZQ-d8J2DgjG8LRsFt4BY7gUdozWghvlwPXp0-49UZk3Z6e7PbL4xg2YfCCNc4UHvTR3DJE_gZwbYgu3HbAm-Vm45Smgzy07IQ=s680-w680-h510-rw",
    bannerImage: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwermvNIOLHXH1zxR3srWwXt3osBqzpLf19RMmOZQ-d8J2DgjG8LRsFt4BY7gUdozWghvlwPXp0-49UZk3Z6e7PbL4xg2YfCCNc4UHvTR3DJE_gZwbYgu3HbAm-Vm45Smgzy07IQ=s680-w680-h510-rw",
    overview: "ETH Zurich is a leading university in science and technology, consistently ranked among the best in the world. It is known for its innovation and research excellence.",
    reputation: "ETH Zurich is renowned for its contributions to science and engineering, with numerous Nobel laureates among its alumni and faculty.",
    programs: [
      { category: "Engineering", courses: ["Mechanical Engineering", "Electrical Engineering", "Civil Engineering"] },
      { category: "Computer Science & AI", courses: ["Computer Science", "Artificial Intelligence", "Data Science"] },
      { category: "Natural Sciences", courses: ["Physics", "Chemistry", "Mathematics", "Biology"] },
      { category: "Medicine & Health Sciences", courses: ["Health Sciences and Technology", "Biomedical Engineering"] },
      { category: "Social Sciences", courses: ["Management, Technology, and Economics"] },
      { category: "Arts & Humanities", courses: ["Architecture"] }
    ],
    durations: { undergraduate: "3 years", masters: "1.5–2 years", phd: "3–4 years" },
    teachingStyle: "A rigorous and research-oriented approach to education, with a strong emphasis on mathematical and scientific foundations.",
    researchOpportunities: "A world leader in research, with state-of-the-art facilities and a focus on solving global challenges.",
    facilities: "Cutting-edge laboratories, extensive libraries, and modern campuses in Zurich.",
    advantages: ["Global leadership in STEM", "Innovation hub", "Strong research culture", "Beautiful Swiss location"],
    careerOpportunities: "Graduates are highly sought after by top engineering, tech, and financial firms globally.",
    ranking: "Ranked #7 in the QS World University Rankings 2024."
  },
  {
    id: "nus",
    name: "National University of Singapore",
    location: "Singapore",
    countryCode: "sg",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerYqFjhWkI6-aaUU0BAZNIKXrZhyTaNk--FpSUZlSli9UYS17Vv5lLc6mjpCCora5gwkgXb27DKki7xQ65S8X2OeGbxFK7LpCQ-AHBa5t0u80RU6w8CMh7w2zk3G1nurQqwTiZn=s680-w680-h510-rw",
    bannerImage: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerYqFjhWkI6-aaUU0BAZNIKXrZhyTaNk--FpSUZlSli9UYS17Vv5lLc6mjpCCora5gwkgXb27DKki7xQ65S8X2OeGbxFK7LpCQ-AHBa5t0u80RU6w8CMh7w2zk3G1nurQqwTiZn=s680-w680-h510-rw",
    overview: "The National University of Singapore (NUS) is a world-class research university and the flagship institution of Singapore. It is known for its global outlook and research impact.",
    reputation: "NUS is consistently ranked as one of the top universities in Asia and the world, known for its academic excellence across a wide range of disciplines.",
    programs: [
      { category: "Computer Science & AI", courses: ["Computer Science", "Information Systems", "Business Analytics"] },
      { category: "Engineering", courses: ["Electrical Engineering", "Mechanical Engineering", "Chemical Engineering"] },
      { category: "Medicine & Health Sciences", courses: ["Medicine", "Nursing", "Pharmacy"] },
      { category: "Business & Management", courses: ["Business Administration", "Economics", "Finance"] },
      { category: "Law", courses: ["Law (LL.B)", "International Law"] },
      { category: "Natural Sciences", courses: ["Mathematics", "Physics", "Chemistry"] }
    ],
    durations: { undergraduate: "3–4 years", masters: "1–2 years", phd: "4–5 years" },
    teachingStyle: "A global and interdisciplinary approach to education, with a strong emphasis on research and innovation.",
    researchOpportunities: "A leading research institution with numerous centers focused on sustainability, health, and technology.",
    facilities: "Modern research facilities, a vibrant campus, and extensive student support services.",
    advantages: ["Top-ranked in Asia", "Global outlook", "Strong research impact", "Vibrant Singapore location"],
    careerOpportunities: "Graduates benefit from Singapore's status as a global financial and tech hub, with strong employment prospects.",
    ranking: "Ranked #8 in the QS World University Rankings 2024."
  }
];
