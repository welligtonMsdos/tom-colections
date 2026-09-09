import { computed, Injectable, signal } from '@angular/core';
import { K7 } from '../components/K7/Model/k7.model';

type K7Seed = Omit<K7, 'guid' | 'photo'> & { photoSeed: string };

const K7_MOCKS: K7Seed[] = [
  { artist: 'The Cure', album: 'Disintegration', year: 1989, price: 42, photoSeed: 'the-cure' },
  { artist: 'Legião Urbana', album: 'Dois', year: 1986, price: 36, photoSeed: 'legiao-urbana' },
  { artist: 'Nina Simone', album: 'I Put a Spell on You', year: 1965, price: 48, photoSeed: 'nina-simone' },
  { artist: 'Racionais MC’s', album: 'Sobrevivendo no Inferno', year: 1997, price: 55, photoSeed: 'racionais' },
  { artist: 'David Bowie', album: 'Let’s Dance', year: 1983, price: 39, photoSeed: 'david-bowie' },
  { artist: 'Marisa Monte', album: 'Mais', year: 1991, price: 34, photoSeed: 'marisa-monte' },
  { artist: 'Radiohead', album: 'OK Computer', year: 1997, price: 58, photoSeed: 'radiohead' },
  { artist: 'Tim Maia', album: 'Racional Vol. 1', year: 1975, price: 62, photoSeed: 'tim-maia' },
  { artist: 'Fleetwood Mac', album: 'Rumours', year: 1977, price: 45, photoSeed: 'fleetwood-mac' },
  { artist: 'Gal Costa', album: 'Índia', year: 1973, price: 52, photoSeed: 'gal-costa' },
  { artist: 'Prince', album: 'Purple Rain', year: 1984, price: 47, photoSeed: 'prince' },
  { artist: 'Chico Buarque', album: 'Construção', year: 1971, price: 60, photoSeed: 'chico-buarque' },
  { artist: 'Sade', album: 'Diamond Life', year: 1984, price: 43, photoSeed: 'sade' },
  { artist: 'Jorge Ben Jor', album: 'África Brasil', year: 1976, price: 49, photoSeed: 'jorge-ben' },
  { artist: 'Kate Bush', album: 'Hounds of Love', year: 1985, price: 51, photoSeed: 'kate-bush' },
  { artist: 'Milton Nascimento', album: 'Clube da Esquina', year: 1972, price: 64, photoSeed: 'milton-nascimento' },
  { artist: 'Björk', album: 'Post', year: 1995, price: 46, photoSeed: 'bjork-post' },
  { artist: 'Djavan', album: 'Luz', year: 1982, price: 38, photoSeed: 'djavan-luz' },
  { artist: 'The Smiths', album: 'The Queen Is Dead', year: 1986, price: 54, photoSeed: 'the-smiths' },
  { artist: 'Elis Regina', album: 'Elis & Tom', year: 1974, price: 66, photoSeed: 'elis-regina' },
  { artist: 'Talking Heads', album: 'Remain in Light', year: 1980, price: 44, photoSeed: 'talking-heads' },
  { artist: 'Caetano Veloso', album: 'Transa', year: 1972, price: 57, photoSeed: 'caetano-transa' },
  { artist: 'Amy Winehouse', album: 'Back to Black', year: 2006, price: 41, photoSeed: 'amy-winehouse' },
  { artist: 'Novos Baianos', album: 'Acabou Chorare', year: 1972, price: 63, photoSeed: 'novos-baianos' },
  { artist: 'Lauryn Hill', album: 'The Miseducation', year: 1998, price: 50, photoSeed: 'lauryn-hill' },
  { artist: 'Belchior', album: 'Alucinação', year: 1976, price: 56, photoSeed: 'belchior' },
  { artist: 'Massive Attack', album: 'Mezzanine', year: 1998, price: 53, photoSeed: 'massive-attack' },
  { artist: 'Cássia Eller', album: 'Com Você… Meu Mundo Ficaria Completo', year: 1999, price: 40, photoSeed: 'cassia-eller' },
  { artist: 'The Clash', album: 'London Calling', year: 1979, price: 59, photoSeed: 'the-clash' },
  { artist: 'Alceu Valença', album: 'Coração Bobo', year: 1980, price: 37, photoSeed: 'alceu-valenca' },
  { artist: 'Erykah Badu', album: 'Baduizm', year: 1997, price: 45, photoSeed: 'erykah-badu' },
  { artist: 'Nação Zumbi', album: 'Da Lama ao Caos', year: 1994, price: 48, photoSeed: 'nacao-zumbi' },
];

@Injectable({ providedIn: 'root' })
export class K7Service {
  private readonly k7Signal = signal<K7[]>(K7_MOCKS.map((item, index) => ({
    guid: `mock-k7-${index + 1}`,
    artist: item.artist,
    album: item.album,
    year: item.year,
    price: item.price,
    photo: `https://picsum.photos/seed/${item.photoSeed}/640/400`,
  })));

  readonly searchTerm = signal('');
  readonly k7s = computed(() => this.k7Signal());
  readonly totalQuantity = computed(() => this.k7Signal().length);
  readonly totalValue = computed(() => this.k7Signal().reduce((total, item) => total + item.price, 0));
}
