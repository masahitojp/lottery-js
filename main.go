package main

import (
	"encoding/json"
	"fmt"
	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
	"math/rand"
	"net/http"
	"regexp"
)

var a int64 = 0

type User struct {
	Id   int64
	Name string
}

type AmidaRequest struct {
	Members []string `json:"members"`
}

type AmidaResult struct {
	Members []string `json:"members"`
	Results []string `json:"results"`
}

func amida(c web.C, w http.ResponseWriter, r *http.Request) {
	req := AmidaRequest{Members: nil}
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	users := req.Members
	for i := range users {
		j := rand.Intn(i + 1)
		users[i], users[j] = users[j], users[i]
	}
	users_len := 4
	if len(users) < 4 {
		users_len = len(users)
	}
	u := AmidaResult{
		Members: users,
		Results: users[0:users_len],
	}
	j, _ := json.Marshal(u)
	fmt.Fprintf(w, string(j))
}

func hello(c web.C, w http.ResponseWriter, r *http.Request) {

	userSlice := []User{}
	a += 1
	u := User{
		Id:   a,
		Name: c.URLParams["name"],
	}
	userSlice = append(userSlice, u)
	j, _ := json.Marshal(userSlice)
	fmt.Fprintf(w, string(j))
}

func Route(m *web.Mux) {
	m.Post("/", amida)
	m.Get("/hello/:name", hello)

	staticPattern := regexp.MustCompile("^/(html|css|js)")
	goji.Handle(staticPattern, http.FileServer(http.Dir("./static")))
}

func main() {
	Route(goji.DefaultMux)
	goji.Serve()
}
