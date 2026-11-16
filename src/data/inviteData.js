/**
 * ALL the text, dates, names, events and photos of the invitation live here.
 * Edit this one file to make the invitation yours – no component changes needed.
 */

// "Son of Mr. A & Mrs. B" helper -> structured so the layout can wrap neatly
const withNames = (lead, a, b) => ({
  text: `${lead} ${a} & ${b}`,
  line: { lead, names: [a, b] },
  joiner: "&",
});

const PLACE = "Lake Pichola, Udaipur";
const MAP = "https://maps.google.com/?q=Lake+Pichola+Udaipur";
const HAVELI = "Rang Mahal Haveli";

const event = (id, o) => ({
  id,
  illustration: "",
  name: "",
  date: "",
  time: "",
  venue: "",
  address: "",
  mapUrl: "",
  ...o,
});

export const inviteData = {
  intro: { enabled: true, unlockLabel: "Tap to open" },
  music: {
    src: "/music/background_music.mp3",
    label: "Background Music",
    credit: "Background Music by Chirag Bajaniya",
    volume: 0.5,
  },

  hero: {
    showDeity: true,
    blessing: "|| Shree Ganeshaya Namah ||",
    introLine: "Together with our families, we invite you to the wedding of",
    partnerOne: "Chirag",
    partnerJoiner: "&",
    partnerTwo: "Bhakti",
    weddingDateISO: "2027-02-12T19:00:00+05:30",
    scrollHint: "Scroll down",
    saveHeading: "Save the Date",
    scratchKicker: "SCRATCH TO UNLOCK",
    scratchTitle: "THE DATE",
    scratchHint: "Rub the gold with your finger",
  },

  families: {
    heading: "The Families",
    one: {
      name: "Chirag Bajaniya",
      parents: withNames(
        "Son of",
        "Mr. Jayntibhai Bajaniya",
        "Mrs. Kavita Rathore",
      ),
      extra: withNames(
        "Grandson of",
        "Late Shri Bhanwar Singh Rathore",
        "Smt. Sushila Devi",
      ),
    },
    two: {
      name: "Ananya Shekhawat",
      parents: withNames(
        "Daughter of",
        "Mr. Rajveer Singh Shekhawat",
        "Mrs. Meenakshi Shekhawat",
      ),
      extra: withNames(
        "Granddaughter of",
        "Shri Narendra Singh Shekhawat",
        "Late Smt. Padma Devi",
      ),
    },
  },

  events: {
    heading: "Wedding Festivities",
    question: "Whose side are you on?",
    sideHint: "Tap a window to see its events",
    directionsLabel: "Get Directions",
    calendarLabel: "Add to Calendar",
    split: true, // true = groom / bride picker, false = one combined schedule
    one: {
      label: "Vihaan",
      team: "Team Groom",
      photo: "/assets/templates/rajasthan-palace/v1/side-groom.webp",
      items: [
        event("g1", {
          illustration: "haldi-1",
          name: "Haldi",
          date: "2027-02-10",
          time: "11:00",
          venue: `Courtyard, ${HAVELI}`,
          address: PLACE,
          mapUrl: MAP,
        }),
        event("g2", {
          illustration: "mehndi-1",
          name: "Mehndi",
          date: "2027-02-10",
          time: "17:00",
          venue: `Garden Terrace, ${HAVELI}`,
          address: PLACE,
          mapUrl: MAP,
        }),
        event("g3", {
          illustration: "sangeet-1",
          name: "Sangeet Night",
          date: "2027-02-11",
          time: "19:30",
          venue: `Darbar Hall, ${HAVELI}`,
          address: PLACE,
          mapUrl: MAP,
        }),
        event("g4", {
          illustration: "wedding-4",
          name: "Baraat & Wedding",
          date: "2027-02-12",
          time: "19:00",
          venue: `Lakeside Lawns, ${HAVELI}`,
          address: PLACE,
          mapUrl: MAP,
        }),
        event("g5", {
          illustration: "wedding-reception-1",
          name: "Reception",
          date: "2027-02-13",
          time: "20:00",
          venue: `Darbar Hall, ${HAVELI}`,
          address: PLACE,
          mapUrl: MAP,
        }),
      ],
    },
    two: {
      label: "Ananya",
      team: "Team Bride",
      photo: "/assets/templates/rajasthan-palace/v1/side-bride.webp",
      items: [
        event("b1", {
          illustration: "lagun-1",
          name: "Lagan & Tilak",
          date: "2027-02-09",
          time: "12:00",
          venue: "Shekhawat Niwas",
          address: "Civil Lines, Jaipur",
        }),
        event("b2", {
          illustration: "mehndi-1",
          name: "Mehndi",
          date: "2027-02-10",
          time: "16:00",
          venue: `Garden Terrace, ${HAVELI}`,
          address: PLACE,
          mapUrl: MAP,
        }),
        event("b3", {
          illustration: "haldi-1",
          name: "Haldi",
          date: "2027-02-11",
          time: "10:30",
          venue: `Courtyard, ${HAVELI}`,
          address: PLACE,
          mapUrl: MAP,
        }),
        event("b4", {
          illustration: "sangeet-2",
          name: "Sangeet Night",
          date: "2027-02-11",
          time: "19:30",
          venue: `Darbar Hall, ${HAVELI}`,
          address: PLACE,
          mapUrl: MAP,
        }),
        event("b5", {
          illustration: "wedding-1",
          name: "Wedding",
          date: "2027-02-12",
          time: "19:00",
          venue: `Lakeside Lawns, ${HAVELI}`,
          address: PLACE,
          mapUrl: MAP,
        }),
      ],
    },
  },

  gallery: {
    heading: "Our Moments",
    subtitle: "A few memories before forever",
    photos: [1, 2, 3, 4, 5].map((n) => ({
      id: `p${n}`,
      src: `/assets/demo-photos/gallery-${n}.webp`,
    })),
  },

  rsvp: {
    kicker: "RSVP",
    heading: "Will You Join Us?",
    note: "Please let us know by 25 January if you can come.",
    nameLabel: "Your name",
    phoneLabel: "Phone number",
    attendanceLabel: "Will you be attending?",
    acceptLabel: "Joyfully Accept",
    declineLabel: "Regretfully Decline",
    noteLabel: "A note for the couple",
    submitLabel: "Send Reply",
    thankYouAccept: "Thank you. We cannot wait to celebrate with you.",
    thankYouDecline: "Thank you for letting us know. You will be missed.",
    sentYesHeading: "See You There!",
    sentNoHeading: "You Will Be Missed",
    sentNote: "Your reply has reached the family.",
  },

  footer: {
    heading: "Thank You",
    message:
      "Your presence, love and blessings mean more to us than we can say. We cannot wait to celebrate this beautiful beginning with you.",
    signoff: "With love,",
    signed: "Vihaan & Ananya",
    hashtag: "#VihaanWedsAnanya",
    button: "Send a Wish Lantern",
    wishes: [
      "May your home always be full of laughter and love",
      "Wishing you a lifetime of happiness, side by side",
      "May every sunrise bring you closer to each other",
      "Blessings for a marriage full of joy and peace",
      "May your love grow stronger with every passing year",
      "Wishing you endless adventures and many sweet memories together",
      "May your journey together be blessed and beautiful",
      "Here is to love, laughter and happily ever after",
    ],
  },
};

/** Which events to show for the picked side (or all, merged and sorted). */
export function getSchedule(events, side) {
  if (events.split) {
    return { both: true, side, items: events[side].items };
  }
  const merged = [...events.one.items, ...events.two.items].sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
  );
  return { both: false, side: "one", items: merged };
}
