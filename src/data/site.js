const media = (filename) => `/Media/${encodeURIComponent(filename).replace(/%26/g, '&')}`

export const photos = {
  logo: media('logo.jpg'),
  hero: media('Our Progress Hero.jpg'),
  about: media('Who are we hero.jpeg'),
  aboutSmall: media('Who are we 2.jpeg'),
  girls: media('Who are we 1.jpeg'),
  voice: media('Her Voice Matters.jpeg'),
  health: media('Health Education.jpg'),
  climate: media('Climate Education.jpeg'),
  peer: media('Our Progress 1.jpg'),
  dialogue: media('Community Dialouge.jpg'),
  mentorship: media('Mentorship.jpg'),
  story: media('Our Progress 2.jpg'),
  impact: media('Our Progress 3.jpg'),
  teamHero: media('Team hero section.jpg'),
  contact: media('Who are we hero.jpeg'),
  gallery1: media('Gallery 2.jpg'),
  gallery2: media('Gallery 3.jpg'),
  gallery3: media('Gallery 4.jpg'),
  gallery4: media('Gallery 5.jpg'),
  gallery5: media('Gallery 6.jpg'),
  gallery6: media('Gallery 7.jpg'),
  teamAugustus: media('Augustus Jozzie Fahnbulleh Excutive Director.jpeg'),
  teamStanley: media('Stanley T M Menbah Jr Program Officer.jpeg'),
  teamAbiola: media('Abiola Beyflan Public Relations Officer.jpeg'),
  teamFelecia: media('Felecia Paye Finance officer.jpeg'),
  teamCyrus: media('Cyrus K Wea Jr.jpeg'),
  teamTimothy: media('Timothy Patrick Koon Communication Officer.jpeg'),
  teamMai: media('Mai Wiakanty-Partnership & Mobilization.jpeg'),
  teamFocus: media('Focus Sonah Bong County Coordinator.jpeg'),
  teamHenell: media('Henell.jpeg'),
  teamJosiah: media('Josiah S Garteh Bong County Coordinator.jpeg'),
}

export const programs = [
  { title: 'Her Voice Matters', tag: 'Advocacy', image: photos.voice, description: 'Building the confidence and platforms girls need to speak up, shape decisions, and lead change in their communities.', slug: 'her-voice-matters' },
  { title: 'My Health, My Rights', tag: 'Health & rights', image: photos.health, description: 'Equipping adolescents with trusted information, peer support, and the agency to make informed health choices.', slug: 'my-health-my-rights' },
  { title: 'Climate Leadership', tag: 'Climate action', image: photos.climate, description: 'Supporting young women to champion climate resilience and practical environmental action at community level.', slug: 'climate-leadership' },
  { title: 'Peer Education', tag: 'Education', image: photos.peer, description: 'Training young leaders to share knowledge, mentor peers, and connect girls with services and opportunities.', slug: 'peer-education' },
  { title: 'Community Dialogue', tag: 'Community', image: photos.dialogue, description: 'Creating space for girls, families, and local leaders to build understanding and take action together.', slug: 'community-dialogue' },
  { title: 'Mentorship Program', tag: 'Leadership', image: photos.mentorship, description: 'Connecting girls with caring mentors who encourage ambition, confidence, and pathways to opportunity.', slug: 'mentorship-program' },
]

export const team = [
  { name: 'Cyrus K. Wea Jr.', role: 'Founder', bio: 'Contributes to Count Her In’s work with young people and communities.', image: photos.teamCyrus },
  { name: 'Augustus Jozzie Fahnbulleh', role: 'Executive Director', bio: 'Leads Count Her In’s work and organizational direction.', image: photos.teamAugustus },
  { name: 'Felecia Paye', role: 'Finance Officer', bio: 'Supports the financial operations behind CHI’s programs and activities.', image: photos.teamFelecia },
  { name: 'Mai Wiakanty', role: 'Partnership & Mobilization', bio: 'Supports Count Her In’s partnership and mobilization work.', image: photos.teamMai },
  { name: 'Focus Sonah', role: 'Bong County Coordinator', bio: 'Coordinates Count Her In activities in Bong County.', image: photos.teamFocus },
  { name: 'Henell', role: 'Team Member', bio: 'Contributes to Count Her In’s work with young people and communities.', image: photos.teamHenell },
  { name: 'Stanley T. M. Menbah Jr.', role: 'Program Officer', bio: 'Supports the delivery of CHI programs with young people and communities.', image: photos.teamStanley },
  { name: 'Abiola Beyflan', role: 'Public Relations Officer', bio: 'Shares the organization’s work and connects its stories with wider audiences.', image: photos.teamAbiola },
  { name: 'Timothy Patrick Koon', role: 'Communication Officer', bio: 'Supports communications and shares Count Her In’s work with wider audiences.', image: photos.teamTimothy },
  { name: 'Josiah S. Garteh', role: 'Bong County Coordinator', bio: 'Coordinates Count Her In activities in Bong County.', image: photos.teamJosiah },
]

export const gallery = [
  { image: media('Gallery 2.jpg'), label: 'Count Her In community outreach', category: 'Community Outreach' },
  { image: media('Gallery 3.jpg'), label: 'Girls learning together', category: 'Workshops' },
  { image: media('Gallery 4.jpg'), label: 'Peer educator training', category: 'Training' },
  { image: media('Gallery 5.jpg'), label: 'A day of shared learning', category: 'Workshops' },
  { image: media('Gallery 6.jpg'), label: 'Young leaders in action', category: 'Leadership Events' },
  { image: media('Gallery 7.jpg'), label: 'Community voices in action', category: 'Community Outreach' },
  { image: media('Gallery 8.jpg'), label: 'Girls building confidence', category: 'Training' },
  { image: media('Gallery 9.jpg'), label: 'Learning and growing', category: 'Workshops' },
  { image: media('Gallery 10.jpg'), label: 'Count Her In community gathering', category: 'Community Outreach' },
  { image: media('Gallery 11.jpg'), label: 'Young women leading', category: 'Leadership Events' },
  { image: media('Gallery 12.jpg'), label: 'Girls sharing ideas', category: 'Workshops' },
  { image: media('Gallery 13.jpg'), label: 'Community learning in action', category: 'Training' },
]

export { media }

export const testimonials = [
  { quote: 'Count Her In helped me find my voice. Now I know that my ideas can make a difference in my community.', name: 'Esther K.', role: 'Peer educator, Montserrado County' },
  { quote: 'I learned that leadership is not about waiting for permission. It begins with caring enough to act.', name: 'Martha W.', role: 'Youth leader, Margibi County' },
  { quote: 'The conversations we started brought girls, parents, and local leaders to the same table for the first time.', name: 'Grace T.', role: 'Community volunteer, Bong County' },
]

export const faqs = [
  { question: 'Where does Count Her In Liberia work?', answer: 'We work alongside girls, families, community leaders, and local partners in communities across Liberia. Our programs are designed with local voices and adapt to the needs of each community.' },
  { question: 'How can I volunteer with CHI?', answer: 'We welcome people who care about girls’ rights, education, and community engagement. Submit the volunteer form and our team will follow up about current opportunities.' },
  { question: 'How are donations used?', answer: 'Contributions support youth-led programming, peer educator training, community dialogues, learning materials, and the coordination needed to deliver our work responsibly.' },
  { question: 'Can my organization partner with CHI?', answer: 'Yes. We work with NGOs, schools, government institutions, community groups, and development partners. Reach out through our contact page to start a conversation.' },
]

export const pageContent = {
  about: { title: 'Our Story', intro: 'We believe every girl deserves to be heard, protected, and free to shape her own future.', image: photos.about, eyebrow: 'About Count Her In', sectionTitle: 'A future built with girls, not just for them', body: 'Count Her In Liberia is a youth-centered organization advancing the rights, leadership, and wellbeing of adolescent girls and young women. We partner with communities to make sure girls are not only included in conversations about their lives, but are leading them.', extra: 'Through advocacy, education, mentorship, and community engagement, we connect young people with the knowledge, confidence, and networks to reach their full potential. Our work begins with listening and grows through action led by the people closest to the change.' },
  programs: { title: 'Our Programs', intro: 'Practical, community-led programs that turn girls’ ideas into lasting change.', image: photos.peer, eyebrow: 'What We Do', sectionTitle: 'A place for every girl to grow', body: 'Our programs make room for girls to learn, lead, and take action on the issues shaping their lives. Each one is built around the strengths and priorities of the communities where we work.', extra: 'From peer education and mentorship to climate leadership and community dialogue, we connect young women with the tools and trusted relationships they need to move forward.' },
  impact: { title: 'Our Impact', intro: 'Real progress starts when girls have the opportunity and support to lead.', image: photos.story, eyebrow: 'The Difference', sectionTitle: 'Progress, made possible together', body: 'Every number represents a young person reached, a new skill learned, or a community conversation that moved an idea forward. Our impact is built with girls, peer educators, volunteers, and local partners.', extra: 'We are committed to learning from our communities, measuring what matters, and sharing how our work is contributing to a Liberia where every girl can thrive.' },
  news: { title: 'News & Updates', intro: 'Stories, reflections, and updates from our work with girls and communities.', image: photos.gallery3, eyebrow: 'From The Field', sectionTitle: 'The latest from Count Her In', body: 'See what is happening across our programs, meet the people behind the progress, and follow the ideas shaping our work.', extra: 'We share these stories to celebrate local leadership, keep our community connected, and make space for more voices to be heard.' },
  events: { title: 'Events', intro: 'Join a conversation, celebration, or learning opportunity in your community.', image: photos.gallery2, eyebrow: 'Come Together', sectionTitle: 'Meet us where change happens', body: 'Our events bring girls, families, local leaders, and partners together to share knowledge and take action.', extra: 'Follow this page for upcoming workshops, community dialogues, youth leadership gatherings, and partner events.' },
}