package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	connStr := "host=192.168.2.42 port=5433 user=murycarry password=Zhangfazhe2! dbname=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec("CREATE DATABASE vapiv")
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Println("Database 'vapiv' created successfully!")
	}
}
