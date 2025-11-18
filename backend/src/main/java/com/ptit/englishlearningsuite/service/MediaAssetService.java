package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.entity.MediaAsset;
import com.ptit.englishlearningsuite.entity.MediaAssetType;
import com.ptit.englishlearningsuite.repository.MediaAssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MediaAssetService {

    @Value("${media.upload-dir:uploads}")
    private String uploadDir;

    @Value("${media.public-prefix:/uploads}")
    private String publicPrefix;

    @Autowired
    private MediaAssetRepository mediaAssetRepository;

    public MediaAsset store(MultipartFile file,
                            MediaAssetType type,
                            String category,
                            String description) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }

        ensureUploadDirExists();

        String storedFilename = UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path destination = Paths.get(uploadDir).resolve(storedFilename).normalize().toAbsolutePath();
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        MediaAsset asset = new MediaAsset();
        asset.setOriginalFilename(file.getOriginalFilename());
        asset.setStoredFilename(storedFilename);
        asset.setContentType(file.getContentType());
        asset.setType(type);
        asset.setCategory(category);
        asset.setDescription(description);
        asset.setPublicUrl(publicPrefix + "/" + storedFilename);
        asset.setCreatedAt(LocalDateTime.now());
        return mediaAssetRepository.save(asset);
    }

    public List<MediaAsset> findAll() {
        return mediaAssetRepository.findAll();
    }

    public void delete(Long id) throws IOException {
        MediaAsset asset = mediaAssetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset không tồn tại"));
        mediaAssetRepository.delete(asset);

        Path path = Paths.get(uploadDir).resolve(asset.getStoredFilename()).normalize().toAbsolutePath();
        Files.deleteIfExists(path);
    }

    private void ensureUploadDirExists() throws IOException {
        Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (Files.notExists(dir)) {
            Files.createDirectories(dir);
        }
    }
}

