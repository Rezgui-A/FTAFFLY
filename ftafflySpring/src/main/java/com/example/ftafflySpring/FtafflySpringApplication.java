package com.example.ftafflySpring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
@EnableScheduling
@SpringBootApplication
public class FtafflySpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(FtafflySpringApplication.class, args);
	}

}
