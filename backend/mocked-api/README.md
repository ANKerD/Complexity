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
	}
}
// response...
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5pY2siOiJoYW5kIn0sImlhdCI6MTU2NjUyMzkxOCwiZXhwIjoxNTY2NTI3NTE4fQ.sRwtfc-SNcUvb6mH4T3V9LXtGZlkwkFZRyC7GSRfCEc"
}
```

```js
// request...
{
	"player": {
		"email": "hand@spinner.com.br",
		"password": "spinner"
	}
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
		"nick": "hand",
		"password": "spinner",
		"email": "hand@spinner.com"
	}
}
// response...
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5pY2siOiJmZWV0In0sImlhdCI6MTU2NjUyNDA2NCwiZXhwIjoxNTY2NTI3NjY0fQ.eWLyKysEiKNOo5tu2EBIB1bA8SBLLi4XTxEhTvUxVKw"
}
```

Nota: O player acima já está cadastrado.
#### ``` GET /player/{nick} ```

```js
// response...
{
    "profile": {
        "nick": "hand",
        "level": 0,
        "problemsSubmitted": [],
        "problemsSolved": [],
        "submissions": 0,
        "teams": [],
        "contests": []
    }
}
```