const u = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const images = {
  ledger: u('photo-1554224155-6726b3ff858f'),
  cards: u('photo-1556742049-0cfed4f6a45d'),
  charts: u('photo-1460925895917-afdab827c52f'),
  plan: u('photo-1454165804606-c3d57bc86b40'),
  coins: u('photo-1579621970563-ebec7560ff3e'),
  notes: u('photo-1526304640581-d334cdbbf45e'),
  phone: u('photo-1620714223084-8fcacc6dfd6d'),
  desert: u('photo-1500382017468-9049fed747ef'),
  avatarA: u('photo-1494790108377-be9c29b29330', 200),
  avatarB: u('photo-1507003211169-0a1dd7228f2d', 200),
  avatarC: u('photo-1438761681033-6461ffad8d80', 200),
}
