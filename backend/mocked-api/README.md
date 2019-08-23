# Mock API

## Setup

#### Pré-requisitos
- Nodejs
- Npm

#### Rodando a aplicação
1. ```npm install```
2. ```npm run dev```

## Docs

### Player

#### ``` POST /player/login ```

```js
// request...
{
	"player": {
		"nick": "hand",
		"password": "spinner"
	},
	"expiration": 157 // segundos de validade pro token (não vai pra api final)
}
// response...
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5pY2siOiJoYW5kIn0sImlhdCI6MTU2NjUyMzkxOCwiZXhwIjoxNTY2NTI3NTE4fQ.sRwtfc-SNcUvb6mH4T3V9LXtGZlkwkFZRyC7GSRfCEc"
}
```

Nota: O player acima já está cadastrado.
#### ``` POST /player/signup ```

```js
// request...
{
	"player": {
		"nick": "feet",
		"password": "spinner",
		"email": "hand@spinner.com"
	}
}
// response...
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5pY2siOiJmZWV0In0sImlhdCI6MTU2NjUyNDA2NCwiZXhwIjoxNTY2NTI3NjY0fQ.eWLyKysEiKNOo5tu2EBIB1bA8SBLLi4XTxEhTvUxVKw"
}
```

Importante: os dados são salvos em memória, então, depois que a aplicação for fechada, os dados criados serão perdidos.