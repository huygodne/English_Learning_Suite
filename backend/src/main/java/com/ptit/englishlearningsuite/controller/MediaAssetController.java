package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.MediaAssetDTO;
import com.ptit.englishlearningsuite.entity.MediaAsset;
import com.ptit.englishlearningsuite.entity.MediaAssetType;
import com.ptit.englishlearningsuite.service.MediaAssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/media")
@PreAuthorize("hasRole('ADMIN')")
public class MediaAssetController {

    @Autowired
    private MediaAssetService mediaAssetService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaAssetDTO> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") MediaAssetType type,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "description", required = false) String description
    ) throws IOException {
        MediaAsset asset = mediaAssetService.store(file, type, category, description);
        return ResponseEntity.ok(MediaAssetDTO.fromEntity(asset));
    }

    @GetMapping
    public ResponseEntity<List<MediaAssetDTO>> list() {
        List<MediaAssetDTO> assets = mediaAssetService.findAll().stream()
                .map(MediaAssetDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(assets);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws IOException {
        mediaAssetService.delete(id);
        return ResponseEntity.noContent().build();
    }
}


