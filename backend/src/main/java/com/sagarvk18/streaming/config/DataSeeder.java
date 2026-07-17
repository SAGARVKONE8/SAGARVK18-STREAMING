package com.sagarvk18.streaming.config;

import com.sagarvk18.streaming.entity.*;
import com.sagarvk18.streaming.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final GenreRepository genreRepository;
    private final ContentRepository contentRepository;
    private final ProfileRepository profileRepository;
    private final SubscriptionPlanRepository planRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedGenres();
        seedPlans();
        seedAdminUser();
        seedContent();
        updateBackdrops();
        log.info("✅ SAGARVK18 STREAMING data seeded successfully!");
    }

    private void seedGenres() {
        if (genreRepository.count() > 0) return;
        List<String> genreNames = Arrays.asList("Action", "Comedy", "Drama", "Thriller", "Horror",
                "Romance", "Sci-Fi", "Animation", "Documentary", "Crime", "Fantasy", "Biography");
        genreNames.forEach(name -> genreRepository.save(Genre.builder().name(name).build()));
        log.info("Genres seeded.");
    }

    private void seedPlans() {
        if (planRepository.count() > 0) return;
        planRepository.save(SubscriptionPlan.builder().name("FREE").price(0.0).quality("SD").screens(1).downloads(0).features("Basic content access").active(true).build());
        planRepository.save(SubscriptionPlan.builder().name("BASIC").price(149.0).quality("HD").screens(2).downloads(5).features("HD streaming, 2 screens").active(true).build());
        planRepository.save(SubscriptionPlan.builder().name("STANDARD").price(349.0).quality("FHD").screens(3).downloads(15).features("Full HD, 3 screens, downloads").active(true).build());
        planRepository.save(SubscriptionPlan.builder().name("PREMIUM").price(649.0).quality("4K").screens(5).downloads(30).features("4K Ultra HD, 5 screens, unlimited downloads").active(true).build());
        log.info("Plans seeded.");
    }

    private void seedAdminUser() {
        if (userRepository.existsByEmail("admin@sagarvk18.com")) {
            User existing = userRepository.findByEmail("admin@sagarvk18.com").orElse(null);
            if (existing != null) {
                existing.setRole(User.Role.ADMIN);
                existing.setPassword(passwordEncoder.encode("Admin@123"));
                userRepository.save(existing);
                log.info("Enforced ADMIN role and Admin@123 password for admin user.");
            }
        } else {
            User admin = User.builder()
                    .name("SAGARVK18 Admin")
                    .email("admin@sagarvk18.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(User.Role.ADMIN)
                    .subscriptionType(User.SubscriptionType.PREMIUM)
                    .build();
            admin = userRepository.save(admin);
            profileRepository.save(Profile.builder().user(admin).name("Admin").avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Admin").build());
        }

        // Demo user
        if (!userRepository.existsByEmail("demo@sagarvk18.com")) {
            User demo = User.builder()
                    .name("Demo User")
                    .email("demo@sagarvk18.com")
                    .password(passwordEncoder.encode("Demo@123"))
                    .role(User.Role.USER)
                    .subscriptionType(User.SubscriptionType.STANDARD)
                    .build();
            demo = userRepository.save(demo);
            profileRepository.save(Profile.builder().user(demo).name("Demo").avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Demo").build());
        }
        log.info("Users seeded.");
    }

    private void seedContent() {
        if (contentRepository.count() > 0) return;
        Genre action = genreRepository.findByName("Action").orElseThrow();
        Genre drama = genreRepository.findByName("Drama").orElseThrow();
        Genre thriller = genreRepository.findByName("Thriller").orElseThrow();
        Genre scifi = genreRepository.findByName("Sci-Fi").orElseThrow();
        Genre comedy = genreRepository.findByName("Comedy").orElseThrow();
        Genre crime = genreRepository.findByName("Crime").orElseThrow();

        List<Content> contents = Arrays.asList(
            Content.builder().title("The Dark Knight").description("Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy.").type(Content.ContentType.MOVIE).language("English").releaseYear(2008).rating(9.0).posterUrl("https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg").backdropUrl("/images/the-dark-knight-backdrop.jpg").trailerUrl("https://www.youtube.com/embed/EXeTwQWrcwY").videoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4").duration(152).isPremium(false).cast("Christian Bale, Heath Ledger, Aaron Eckhart").director("Christopher Nolan").ageRating("PG-13").views(50000L).genres(Arrays.asList(action, drama, thriller)).build(),
            Content.builder().title("Inception").description("A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.").type(Content.ContentType.MOVIE).language("English").releaseYear(2010).rating(8.8).posterUrl("https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg").backdropUrl("https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg").trailerUrl("https://www.youtube.com/embed/YoHD9XEInc0").videoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4").duration(148).isPremium(true).cast("Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page").director("Christopher Nolan").ageRating("PG-13").views(45000L).genres(Arrays.asList(action, scifi, thriller)).build(),
            Content.builder().title("Breaking Bad").description("A chemistry teacher turned methamphetamine producer partners with a former student to secure his family's financial future.").type(Content.ContentType.SERIES).language("English").releaseYear(2008).rating(9.5).posterUrl("https://image.tmdb.org/t/p/w500/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg").backdropUrl("https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg").trailerUrl("https://www.youtube.com/embed/HhesaQXLuRY").videoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4").duration(45).isPremium(true).cast("Bryan Cranston, Aaron Paul, Anna Gunn").director("Vince Gilligan").ageRating("TV-MA").views(80000L).genres(Arrays.asList(drama, thriller, crime)).build(),
            Content.builder().title("3 Idiots").description("Two friends search for their missing companion while recalling the memories of their college days.").type(Content.ContentType.MOVIE).language("Hindi").releaseYear(2009).rating(8.4).posterUrl("https://image.tmdb.org/t/p/w500/66A9MqM76UbSBCN8GUVKOjK0uqd.jpg").backdropUrl("https://image.tmdb.org/t/p/original/cRqSBgwkFCbBNY4WqHnk7Tg74Vc.jpg").trailerUrl("https://www.youtube.com/embed/K0eDlFX9GMc").videoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4").duration(170).isPremium(false).cast("Aamir Khan, Madhavan, Sharman Joshi").director("Rajkumar Hirani").ageRating("U").views(70000L).genres(Arrays.asList(comedy, drama)).build(),
            Content.builder().title("Avengers: Endgame").description("After the devastating events of Infinity War, the Avengers assemble once more to undo Thanos' actions.").type(Content.ContentType.MOVIE).language("English").releaseYear(2019).rating(8.4).posterUrl("https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg").backdropUrl("https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg").trailerUrl("https://www.youtube.com/embed/TcMBFSGVi1c").videoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4").duration(181).isPremium(true).cast("Robert Downey Jr., Chris Evans, Mark Ruffalo").director("Russo Brothers").ageRating("PG-13").views(95000L).genres(Arrays.asList(action, scifi)).build(),
            Content.builder().title("Money Heist").description("A criminal mastermind called The Professor plans the perfect heist with eight thieves taking hostages inside the Royal Mint.").type(Content.ContentType.SERIES).language("Spanish").releaseYear(2017).rating(8.3).posterUrl("https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg").backdropUrl("/images/money-heist-backdrop.jpg").trailerUrl("https://www.youtube.com/embed/htNS2I-cFkE").videoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4").duration(50).isPremium(true).cast("Álvaro Morte, Úrsula Corberó, Itziar Ituño").director("Álex Pina").ageRating("TV-MA").views(60000L).genres(Arrays.asList(crime, drama, thriller)).build(),
            Content.builder().title("Dangal").description("Former wrestler Mahavir Singh Phogat trains his daughters to become world-class wrestlers.").type(Content.ContentType.MOVIE).language("Hindi").releaseYear(2016).rating(8.4).posterUrl("https://image.tmdb.org/t/p/w500/jhBP2cNfRhL0fSXMcmBQimMxlgw.jpg").backdropUrl("https://image.tmdb.org/t/p/original/3TKu5BaR0SiEzfajABfQ5AQSoJG.jpg").trailerUrl("https://www.youtube.com/embed/x_7YlGv9u1g").videoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4").duration(161).isPremium(false).cast("Aamir Khan, Fatima Sana Shaikh, Sanya Malhotra").director("Nitesh Tiwari").ageRating("U").views(65000L).genres(Arrays.asList(drama)).build(),
            Content.builder().title("Stranger Things").description("When a young boy disappears, his mother, friends, and local police must confront a terrifying supernatural force.").type(Content.ContentType.SERIES).language("English").releaseYear(2016).rating(8.7).posterUrl("https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg").backdropUrl("https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg").trailerUrl("https://www.youtube.com/embed/b9EkMc79ZSU").videoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4").duration(50).isPremium(true).cast("Millie Bobby Brown, Finn Wolfhard, Winona Ryder").director("Duffer Brothers").ageRating("TV-14").views(75000L).genres(Arrays.asList(drama, thriller, scifi)).build()
        );
        contentRepository.saveAll(contents);
        log.info("Content seeded.");
    }

    private void updateBackdrops() {
        contentRepository.findAll().forEach(c -> {
            if ("The Dark Knight".equals(c.getTitle())) {
                c.setBackdropUrl("/images/the-dark-knight-backdrop.jpg");
                contentRepository.save(c);
            } else if ("Money Heist".equals(c.getTitle())) {
                c.setBackdropUrl("/images/money-heist-backdrop.jpg");
                contentRepository.save(c);
            }
        });
    }
}
