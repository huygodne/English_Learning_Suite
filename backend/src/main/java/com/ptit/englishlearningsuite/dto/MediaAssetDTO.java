package com.ptit.englishlearningsuite.dto;

import com.ptit.englishlearningsuite.entity.MediaAsset;
import com.ptit.englishlearningsuite.entity.MediaAssetType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MediaAssetDTO {
    private Long id;
    private String originalFilename;
    private String storedFilename;
    private String contentType;
    private MediaAssetType type;
    private String category;
    private String description;
    private String publicUrl;
    private LocalDateTime createdAt;

    public static MediaAssetDTO fromEntity(MediaAsset asset) {
        MediaAssetDTO dto = new MediaAssetDTO();
        dto.setId(asset.getId());
        dto.setOriginalFilename(asset.getOriginalFilename());
        dto.setStoredFilename(asset.getStoredFilename());
        dto.setContentType(asset.getContentType());
        dto.setType(asset.getType());
        dto.setCategory(asset.getCategory());
        dto.setDescription(asset.getDescription());
        dto.setPublicUrl(asset.getPublicUrl());
        dto.setCreatedAt(asset.getCreatedAt());
        return dto;
    }
}



