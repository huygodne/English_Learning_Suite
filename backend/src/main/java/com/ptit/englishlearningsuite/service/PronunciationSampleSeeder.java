package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.entity.PronunciationSample;
import com.ptit.englishlearningsuite.repository.PronunciationSampleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PronunciationSampleSeeder implements CommandLineRunner {

    @Value("${pronunciation.seed.enabled:true}")
    private boolean seedEnabled;

    @Autowired
    private PronunciationSampleRepository pronunciationSampleRepository;

    @Override
    public void run(String... args) {
        if (!seedEnabled || pronunciationSampleRepository.count() > 0) {
            return;
        }

        List<PronunciationSample> artSamples = List.of(
                createSample("Hội họa", "Paint", "/peɪnt/", "Màu sơn", 
                        "https://cdn.pixabay.com/photo/2016/03/31/19/58/art-1295507_1280.png",
                        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_4e084c12b0.mp3?filename=soft-paint-brush-ambient-19417.mp3"),
                createSample("Hội họa", "Brush", "/brʌʃ/", "Cọ vẽ", 
                        "https://cdn.pixabay.com/photo/2017/08/27/10/16/interior-2685521_1280.jpg",
                        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_a2a82e6a9e.mp3?filename=paint-colors-19415.mp3")
        );

        pronunciationSampleRepository.saveAll(artSamples);
    }

    private PronunciationSample createSample(String category,
                                             String term,
                                             String ipa,
                                             String description,
                                             String imageUrl,
                                             String audioUrl) {
        PronunciationSample sample = new PronunciationSample();
        sample.setCategory(category);
        sample.setTerm(term);
        sample.setIpa(ipa);
        sample.setDescription(description);
        sample.setImageUrl(imageUrl);
        sample.setAudioUrl(audioUrl);
        return sample;
    }
}

