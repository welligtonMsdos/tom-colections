# Instruções do projeto Angular

## Prioridade das regras

- Siga as instruções do usuário quando conflitarem com este arquivo.
- Antes de criar ou alterar arquivos, analise a estrutura e os padrões já existentes no projeto.
- Reutilize código, componentes, services, interfaces e utilitários existentes antes de criar novos.
- Não altere arquivos não relacionados à tarefa.

## Angular

- Siga a versão, as convenções e a arquitetura Angular já usadas no projeto.
- Prefira componentes standalone se esse já for o padrão adotado.
- Use tipagem explícita em TypeScript. Evite `any`.
- Mantenha lógica de negócio fora dos componentes sempre que possível.
- Não crie services duplicados. Procure primeiro em `src/app/**/services` e nas pastas de domínio relacionadas.
- Crie um service somente quando não existir um equivalente adequado.
- Services devem usar `providedIn: 'root'`, salvo motivo arquitetural claro para outro escopo.
- Centralize chamadas HTTP em services.
- Crie interfaces ou types para contratos de API e modelos de domínio.
- Trate estados de carregamento, erro e vazio em telas que consomem dados assíncronos.
- Preserve a estrutura de pastas e o padrão de nomenclatura existentes.

## Estilos

- Antes de escrever CSS/SCSS customizado, verifique se o resultado pode ser obtido com Bootstrap ou Angular Material.
- Não recrie em CSS local estilos, componentes ou comportamentos já disponíveis nessas bibliotecas.
- Antes de criar CSS ou SCSS local, verifique os estilos globais disponíveis:
  - `src/styles.scss`
  - `src/styles.css`
  - Arquivos de tema, variáveis, mixins, tokens e utilitários globais.
- Reutilize classes globais, tokens, variáveis CSS e mixins existentes.
- Crie estilos locais apenas quando forem específicos do componente.
- Não duplique cores, espaçamentos, breakpoints ou estilos já definidos globalmente.
- Mantenha responsividade e acessibilidade.

## Formatação obrigatória de HTML e CSS

- Nunca gere HTML, CSS ou SCSS em uma única linha.
- Todo elemento HTML deve ficar em linhas separadas, com indentação de 2 espaços.
- Quando um elemento possuir atributos, cada atributo deve ficar em sua própria linha.
- Não compacte tags filhas na mesma linha.
- Cada propriedade CSS ou SCSS deve ficar em uma linha separada.
- Cada seletor CSS ou SCSS deve ter seu próprio bloco.
- Preserve essa formatação mesmo quando o código for curto.
- Não execute formatadores que compactem HTML, CSS ou SCSS em uma única linha.
- Ao alterar arquivos existentes compactados, formate verticalmente apenas o trecho alterado.

### Exemplo obrigatório de HTML

```html
<button
  type="button"
  class="btn btn-primary"
  [disabled]="isLoading"
  (click)="save()"
>
  Salvar
</button>
```

### Exemplo obrigatório de SCSS

```scss
.user-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
}

.user-card__title {
  margin: 0;
  color: var(--color-primary);
}
```

## Formatação de TypeScript

- Escreva código verticalmente e de forma legível.
- Evite linhas muito longas e aninhamento excessivo.
- Prefira retornos antecipados para reduzir blocos `if` aninhados.
- Separe propriedades, imports, parâmetros e chamadas longas em múltiplas linhas.
- Siga Prettier, ESLint e demais configurações existentes, desde que não contrariem a regra de formatação vertical de HTML, CSS e SCSS.

### Exemplo preferido de TypeScript

```ts
this.userService
  .getById(userId)
  .pipe(
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe({
    next: (user) => {
      this.user = user;
    },
    error: () => {
      this.loadError = true;
    },
  });
```

## Antes de finalizar uma tarefa

- Execute os checks relevantes já configurados no projeto, como lint, testes ou build.
- Informe os arquivos criados ou alterados.
- Informe verificações não executadas e limitações relevantes.
