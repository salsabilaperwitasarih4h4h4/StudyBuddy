import React, { useState, useRef } from 'react';
import { AttachedFile, LectureNote } from '../types';
import { registerFile, downloadFileDirectly, getFileObjectUrl } from '../services/fileStorageService';
import { 
  UploadCloud, FileText, Trash2, Download, Paperclip, 
  Sparkles, BookOpen, User, X, Eye, Image as ImageIcon, 
  AlertCircle, CheckCircle2 
} from 'lucide-react';

interface NotesPageProps {
  notes: LectureNote[];
  onSaveNote: (note: LectureNote) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({ notes, onSaveNote, onDeleteNote }) => {
  const [title, setTitle] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [course, setCourse] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Instant zero-lag file processing using ObjectURL & memory registry
  const processFiles = (fileList: FileList | File[]) => {
    setFileError(null);
    const incomingFiles = Array.from(fileList);
    if (incomingFiles.length === 0) return;

    const availableSlots = 5 - files.length;
    if (availableSlots <= 0) {
      setFileError('Maksimal batas 5 berkas per catatan sudah tercapai.');
      return;
    }

    if (incomingFiles.length > availableSlots) {
      setFileError(`Hanya ${availableSlots} berkas lagi yang ditambahkan (maksimal 5 berkas).`);
    }

    const filesToAdd = incomingFiles.slice(0, availableSlots);
    const registered = filesToAdd.map((f) => registerFile(f));

    // Instantly append without waiting or loading!
    setFiles((prev) => [...prev, ...registered]);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setFileError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNote: LectureNote = {
      id: 'note-' + Date.now(),
      title: title.trim(),
      lecturer: lecturer.trim() || undefined,
      course: course.trim() || undefined,
      content: content.trim(),
      files,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    onSaveNote(newNote);
    setTitle('');
    setLecturer('');
    setCourse('');
    setContent('');
    setFiles([]);
    setFileError(null);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs">
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
            SIMPAN YANG PENTING
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162B20]">
            Catatan materi
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Simpan ringkasan kuliah penting dari dosen dan lampirkan hingga maksimal 5 file materi tanpa loading lama.
          </p>
        </div>

        {saveSuccess && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Catatan materi dan lampiran berkas berhasil disimpan!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
              Judul materi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pertemuan 5 - Analisis Kompleksitas Algoritma"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-sm text-[#1A2820] shadow-2xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
                Dosen Pengampu (Opsional)
              </label>
              <input
                type="text"
                value={lecturer}
                onChange={(e) => setLecturer(e.target.value)}
                placeholder="Contoh: Dr. Budi Santoso, M.Kom"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-sm text-[#1A2820] shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
                Mata Kuliah (Opsional)
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="Contoh: Algoritma & Struktur Data"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-sm text-[#1A2820] shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
              Isi catatan
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis ringkasan rumus, poin penting dosen, penjelasan bab, atau catatan refleksi di sini..."
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-sm text-[#1A2820] shadow-2xs resize-y"
              required
            />
          </div>

          {/* Instant File Upload Section (Max 5 files) */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#2C3B32] flex items-center gap-1.5">
                <span>📎</span>
                <span>Unggah Berkas Materi Pendukung</span>
              </span>
              <span className={`font-bold px-2.5 py-0.5 rounded-md ${
                files.length >= 5 ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-600'
              }`}>
                Maksimal 5 berkas ({files.length}/5)
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              multiple
              disabled={files.length >= 5}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/*"
              className="hidden"
              id="file-upload-input"
            />

            <label
              htmlFor={files.length < 5 ? 'file-upload-input' : undefined}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center transition-all ${
                files.length >= 5
                  ? 'border-stone-200 bg-stone-50 cursor-not-allowed opacity-60'
                  : isDragging
                  ? 'border-[#1E3F2B] bg-[#EAF2EC] scale-[1.01]'
                  : 'border-[#D9D2C3] bg-[#FAF8F4] hover:bg-[#F3EFE7] hover:border-[#1E3F2B] cursor-pointer'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#EAE5D9] flex items-center justify-center text-stone-600 mb-2">
                <UploadCloud className="w-5 h-5 text-[#1E3F2B]" />
              </div>
              <p className="text-xs font-bold text-[#162B20]">
                {files.length >= 5
                  ? 'Kapasitas maksimal 5 berkas telah tercapai'
                  : isDragging
                  ? 'Lepaskan file di sini untuk mengunggah instan'
                  : 'Pilih atau seret berkas materi ke sini'}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Mendukung PDF, Word, PowerPoint, Gambar Slide, Excel, atau TXT (Langsung terlampir instan)
              </p>
            </label>

            {fileError && (
              <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-xl mt-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* List of files pending save */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-bold text-stone-600 block">
                  Berkas Terpilih ({files.length}/5):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {files.map((f) => (
                    <div
                      key={f.id}
                      className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {f.type.startsWith('image/') ? (
                          <ImageIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <Paperclip className="w-4 h-4 text-stone-400 shrink-0" />
                        )}
                        <span className="font-semibold text-stone-800 truncate max-w-[150px]">
                          {f.name}
                        </span>
                        <span className="text-[10px] text-stone-400 shrink-0">
                          ({formatFileSize(f.size)})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(f.id)}
                        className="text-stone-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                        title="Hapus berkas ini"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#1E3F2B] hover:bg-[#163323] text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer mt-4"
          >
            <span>Simpan catatan</span>
          </button>
        </form>
      </div>

      {/* Materi Tersimpan List Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs">
        <h3 className="text-xl font-bold text-[#162B20] mb-4">
          Materi tersimpan
        </h3>

        {notes.length === 0 ? (
          <div className="py-12 text-center text-stone-400 text-sm">
            <BookOpen className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p>Belum ada catatan. Tulis poin penting dari dosenmu di sini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-[#162B20]">
                      {note.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-1">
                      {note.course && (
                        <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {note.course}
                        </span>
                      )}
                      {note.lecturer && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-stone-400" />
                          <span>{note.lecturer}</span>
                        </span>
                      )}
                      <span>•</span>
                      <span>{note.createdAt}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="self-end sm:self-auto p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus catatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 whitespace-pre-line leading-relaxed bg-white/70 p-3.5 rounded-xl border border-[#EEE8DC]">
                  {note.content}
                </p>

                {/* Attached files download badges */}
                {note.files && note.files.length > 0 && (
                  <div className="pt-2 border-t border-[#EAE3D5]">
                    <span className="text-[11px] font-bold text-stone-500 block mb-2">
                      Lampiran Berkas ({note.files.length} / 5 berkas):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {note.files.map((file) => (
                        <div
                          key={file.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DFD7CB] text-xs font-semibold text-[#1E3F2B] transition-all shadow-2xs group"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate max-w-[130px] sm:max-w-[160px]">{file.name}</span>
                          <span className="text-[10px] text-stone-400">({formatFileSize(file.size)})</span>

                          <div className="flex items-center gap-1 ml-1 pl-1 border-l border-stone-200">
                            <button
                              type="button"
                              onClick={() => setPreviewFile(file)}
                              className="text-stone-400 hover:text-[#1E3F2B] p-0.5 cursor-pointer"
                              title="Lihat berkas"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => downloadFileDirectly(file)}
                              className="text-stone-400 hover:text-emerald-700 p-0.5 cursor-pointer"
                              title="Unduh berkas"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#DFD7CB] space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-5 h-5 text-emerald-700 shrink-0" />
                <h4 className="font-bold text-sm text-[#162B20] truncate">
                  {previewFile.name}
                </h4>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-2 bg-stone-50 rounded-2xl min-h-[180px]">
              {previewFile.type.startsWith('image/') ? (
                <img
                  src={getFileObjectUrl(previewFile)}
                  alt={previewFile.name}
                  className="max-h-64 object-contain rounded-xl"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <FileText className="w-12 h-12 mx-auto text-emerald-800" />
                  <p className="text-xs font-semibold text-stone-700">
                    {previewFile.name}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Ukuran: {formatFileSize(previewFile.size)} • Format: {previewFile.type}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => downloadFileDirectly(previewFile)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1E3F2B] hover:bg-[#163323] text-white cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Berkas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote */}
      <div className="bg-[#EBE7DC]/60 border border-[#DDD6C8] rounded-2xl p-4 text-center text-xs text-[#44554B] italic flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>"Catatan yang rapi adalah investasi terbaik saat pekan ujian tiba."</span>
      </div>
    </div>
  );
};
