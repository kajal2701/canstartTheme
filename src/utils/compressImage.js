export const compressImage = (
    file,
    maxWidth = 2000,
    maxHeight = 2000,
    quality = 0.9
) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            let width = img.naturalWidth;
            let height = img.naturalHeight;

            // Resize only if image is larger than the maximum size
            const ratio = Math.min(
                maxWidth / width,
                maxHeight / height,
                1
            );

            width = Math.round(width * ratio);
            height = Math.round(height * ratio);

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("Image compression failed"));
                        return;
                    }

                    const fileName =
                        file.name.replace(/\.[^/.]+$/, "") + ".webp";

                    const compressedFile = new File(
                        [blob],
                        fileName,
                        {
                            type: "image/webp",
                            lastModified: Date.now(),
                        }
                    );

                    resolve(compressedFile);
                },
                "image/webp",
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Unable to load image"));
        };

        img.src = objectUrl;
    });
};