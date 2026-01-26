// import { HTTP_REQUEST_METHOD } from '../../enums/httpRequest';
// import httpRequest from './httpRequest';

// const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjgwM2ZhMjBjYzExMzFlNTYxYmNlOGNhMGM3MjZjNCIsIm5iZiI6MTc2OTQxNzk4My44ODMwMDAxLCJzdWIiOiI2OTc3MmNmZjliN2Y1OTA2ZjgwODkxYjkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.McYOWRvHJh4yrv1hdAdbxSU90enszC640eabMT2-pRE';
// const BASE_URL = 'https://api.themoviedb.org/3';

const MOCK_RESPONSE = {
  page: 1,
  results: [
    {
      title: 'The Rip',
      overview: 'Trust frays when a team of Miami cops discovers millions in cash inside a run-down stash house, calling everyone — and everything — into question.',
    },
    {
      title: 'Dust Bunny',
      overview: 'Ten-year-old Aurora asks her hitman neighbor to kill the monster under her bed that she claims ate her family. To protect her, he must battle an onslaught of assassins while accepting that some monsters are real.',
    },
    {
      title: 'Predator: Badlands',
      overview: 'Cast out from his clan, a young Predator finds an unlikely ally in a damaged android and embarks on a treacherous journey in search of the ultimate adversary.',
    },
    {
      title: 'Avatar: Fire and Ash',
      overview: "In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face a new threat on Pandora: the Ash People, a violent and power-hungry Na'vi tribe led by the ruthless Varang.",
    },
    {
      title: 'Strangers',
      overview: "Seeking revenge on her abusive husband, a woman's life takes a dark turn when she meets a mysterious hitman. Drawn into a whirlwind romance, she spirals into a dangerous vigilante spree.",
    },
    {
      title: 'The SpongeBob Movie: Search for SquarePants',
      overview: 'Desperate to be a big guy, SpongeBob sets out to prove his bravery to Mr. Krabs by following The Flying Dutchman on a seafaring adventure that takes him to the deepest depths of the deep sea.',
    },
    {
      title: 'The Housemaid',
      overview: 'Trying to escape her past, Millie Calloway accepts a job as a live-in housemaid for the wealthy Nina and Andrew Winchester. But what begins as a dream job quickly unravels into something far more dangerous.',
    },
    {
      title: 'Zootopia 2',
      overview: "After cracking the biggest case in Zootopia's history, Judy Hopps and Nick Wilde find themselves on the twisting trail of a great mystery.",
    },
    {
      title: 'Icefall',
      overview: 'A young Indigenous game warden arrests an infamous poacher only to discover the poacher knows the location of a plane carrying millions of dollars that has crashed in a frozen lake.',
    },
    {
      title: 'Killer Whale',
      overview: 'Follows best friends Maddie and Trish as they find themselves trapped in a remote lagoon with the dangerous killer whale named Ceto.',
    },
    {
      title: 'War of the Worlds',
      overview: 'Will Radford is a top analyst for Homeland Security who tracks threats through a mass surveillance program, until one day an attack leads him to question everything.',
    },
    {
      title: 'The Tank',
      overview: 'A German Tiger tank crew is sent on a dangerous mission to rescue a missing officer from a top-secret bunker behind enemy lines.',
    },
    {
      title: 'Sinners',
      overview: 'Twin brothers return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.',
    },
    {
      title: 'Demon Slayer: Kimetsu no Yaiba Infinity Castle',
      overview: 'The Demon Slayer Corps are drawn into the Infinity Castle, where Tanjiro and the Hashira face terrifying Upper Rank demons.',
    },
    {
      title: "The Shadow's Edge",
      overview: 'Macau Police brings a tracking expert out of retirement to help catch a dangerous group of professional thieves.',
    },
    {
      title: '28 Years Later: The Bone Temple',
      overview: 'Dr. Kelson finds himself in a shocking new relationship with consequences that could change the world.',
    },
    {
      title: 'Bāhubali: The Epic',
      overview: 'A mysterious child grows up to discover his connection to a lost kingdom and a destiny shaped by betrayal and sacrifice.',
    },
    {
      title: "Now You See Me: Now You Don't",
      overview: 'The Four Horsemen reunite to take on a powerful criminal mastermind in their most ambitious heist yet.',
    },
    {
      title: 'Trap House',
      overview: "An undercover DEA agent discovers that the criminals he's chasing may be closer to home than he imagined.",
    },
    {
      title: 'Omniscient Reader: The Prophecy',
      overview: "A man discovers the novel he's been reading has become reality, and he may be the only one who knows how the story ends.",
    },
  ],
};

export const fetchPopularMovies = async (page: number) => {
  // const response = await httpRequest(
  //   BASE_URL,
  //   '/movie/popular',
  //   {
  //     language: 'en-US',
  //     page,
  //   },
  //   HTTP_REQUEST_METHOD.GET,
  //   {
  //     accept: 'application/json',
  //     Authorization: `Bearer ${TOKEN}`,
  //   }
  // );

  // if (page > 2) {
  //   return {
  //     page: page,
  //     results: [],
  //   };
  // }

  const generateResponse = () => ({
    page,
    results: [
      ...MOCK_RESPONSE.results.map((el, index) => ({
        ...el,
        id: `${page}_${index}`,
      })),
    ],
  });

  return generateResponse();
};
