import { Component, inject } from '@angular/core';
import { GithubService } from '../services/github/github.service';
import { CommonModule } from '@angular/common';
import { GitHubResponse, Item } from '../Interfaces/repositories.interface';

interface ProgramLanguajeReq {
  title: string,
  value: string
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  repository: Item | null = null;
  languages: ProgramLanguajeReq[] = []
  selectedLanguage: string = ''
  loading: boolean = false
  err: boolean = false;

  constructor(private github: GithubService) {
    this.languages = github.languages
  }

  getRandom(language: string) {
    this.err = false
    this.loading = true
    this.repository = null;
    this.github.getRepos(language).subscribe((response: any) => {
      const items = response.items;
      if (!items || items.length === 0) {
        this.repository = null;
        return;
      }
      const idx = Math.floor(Math.random() * items.length)

      this.repository = items[idx]
      this.loading = false

    }, (error) => {
      this.err = true;
      this.loading = false
    })

  }




  onChange(language: Event) {
    const target = (language.target as HTMLSelectElement).value

    if (target === '') {
      this.repository = null
      return;
    }

    this.selectedLanguage = target
    this.getRandom(target)
  }

  refresh() {
    if (this.selectedLanguage) {
      this.getRandom(this.selectedLanguage)
    }
  }

  retry() {
    this.err = false;
    if (this.selectedLanguage) {
      this.getRandom(this.selectedLanguage)
    }
  }
}
