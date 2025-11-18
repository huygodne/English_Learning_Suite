package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.entity.PronunciationSample;
import com.ptit.englishlearningsuite.repository.PronunciationSampleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PronunciationSampleSeeder {

    @Value("${pronunciation.seed.enabled:true}")
    private boolean seedEnabled;

    @Autowired
    private PronunciationSampleRepository pronunciationSampleRepository;

    @PostConstruct
    public void ensureArtSamplesPresent() {
        if (!seedEnabled) {
            return;
        }

        List<PronunciationSample> artSamples = List.of(
                createSample("Hội họa", "easel", "/ˈiː.zəl/", "Giá vẽ - khung dùng để dựng tranh khi vẽ",
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
                        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_4e084c12b0.mp3?filename=soft-paint-brush-ambient-19417.mp3"),
                createSample("Hội họa", "palette", "/ˈpæl.ət/", "Bảng màu - nơi họa sĩ pha màu",
                        "https://images.unsplash.com/photo-1461344577544-4e5dc9487184?w=600",
                        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_a2a82e6a9e.mp3?filename=paint-colors-19415.mp3"),
                createSample("Hội họa", "strokes", "/stroʊks/", "Nét cọ - đường nét khi quét cọ",
                        "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=600",
                        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_873d61bb64.mp3?filename=brush-stroke-19416.mp3"),
                createSample("Hội họa", "gallery", "/ˈɡæl.ər.i/", "Phòng triển lãm - nơi trưng bày tác phẩm",
                        "https://images.unsplash.com/photo-1465311440653-ba9b1d68da21?w=600",
                        "https://cdn.pixabay.com/download/audio/2021/09/01/audio_6d6a1107f8.mp3?filename=calm-gallery-ambient-8336.mp3")
        );

        artSamples.forEach(sample -> {
            if (!pronunciationSampleRepository.existsByCategoryIgnoreCaseAndTermIgnoreCase(
                    sample.getCategory(), sample.getTerm())) {
                pronunciationSampleRepository.save(sample);
            }
        });
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





