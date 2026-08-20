package com.sagarvk18.streaming.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:#{null}}")
    private String rawUrl;

    @Value("${spring.datasource.username:#{null}}")
    private String username;

    @Value("${spring.datasource.password:#{null}}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String dbUrl = rawUrl;
        String dbUser = username;
        String dbPass = password;

        String envDatabaseUrl = System.getenv("DATABASE_URL");
        if (envDatabaseUrl != null && !envDatabaseUrl.trim().isEmpty()) {
            dbUrl = envDatabaseUrl;
        }

        // Convert mysql:// URI format to JDBC format if needed
        if (dbUrl != null && dbUrl.startsWith("mysql://")) {
            try {
                String cleanUrl = dbUrl.replaceFirst("^mysql://", "http://");
                URI uri = new URI(cleanUrl);

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":");
                    dbUser = userInfo[0];
                    if (userInfo.length > 1) {
                        dbPass = userInfo[1];
                    }
                }

                int port = uri.getPort() == -1 ? 3306 : uri.getPort();
                String path = uri.getPath();
                dbUrl = "jdbc:mysql://" + uri.getHost() + ":" + port + path + "?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
            } catch (URISyntaxException e) {
                dbUrl = dbUrl.replaceFirst("^mysql://", "jdbc:mysql://");
            }
        }

        HikariConfig config = new HikariConfig();
        if (dbUrl != null && !dbUrl.isEmpty()) {
            config.setJdbcUrl(dbUrl);
        } else {
            config.setJdbcUrl("jdbc:mysql://localhost:3306/sagarvk18_streaming?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true");
        }

        if (dbUser != null && !dbUser.isEmpty()) {
            config.setUsername(dbUser);
        } else {
            config.setUsername("root");
        }

        if (dbPass != null && !dbPass.isEmpty()) {
            config.setPassword(dbPass);
        } else {
            config.setPassword("root123");
        }

        // Set MySQL driver explicitly
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");

        return new HikariDataSource(config);
    }
}
