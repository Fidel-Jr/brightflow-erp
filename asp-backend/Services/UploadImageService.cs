namespace asp_backend.Services
{
    public class UploadImageService
    {
        private readonly IWebHostEnvironment _environment;

        public UploadImageService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> UploadImageAsync(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty.");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                throw new ArgumentException("Invalid file type.");

            if (file.Length > 5 * 1024 * 1024)
                throw new ArgumentException("File size exceeds 5MB.");

            var rootPath = _environment.WebRootPath
                           ?? Path.Combine(_environment.ContentRootPath, "wwwroot");

            var uploadsFolder = Path.Combine(rootPath, folderName);

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid() + extension;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/{folderName}/{uniqueFileName}";
        }


        public void DeleteImage(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                return;

            var fullPath = Path.Combine(
                _environment.WebRootPath,
                filePath.TrimStart('/')
            );

            if (File.Exists(fullPath))
                File.Delete(fullPath);
        }

    }
}
