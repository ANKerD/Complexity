# Mock API

### Player

#### ``` POST /player/login ```

``` json
// request...
{
	"credentials": {
		"nick": "hand",
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

``` json
// request...
{
	"player": {
		"nick": "feet",
		"password": "spinner"
	}
}
// response...
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5pY2siOiJmZWV0In0sImlhdCI6MTU2NjUyNDA2NCwiZXhwIjoxNTY2NTI3NjY0fQ.eWLyKysEiKNOo5tu2EBIB1bA8SBLLi4XTxEhTvUxVKw"
}
```

Importante: os dados são salvos em memória, então, depois que a aplicação for fechada, os dados criados serão perdidos.