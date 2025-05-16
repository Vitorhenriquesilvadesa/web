import { getCharacter } from "../../../helper";
import "./Files.css";

interface FilesProps {
  files: string[];
}

export default function Files({ files }: FilesProps) {
  return (
    <div className="files">
      {files.map((file: string) => (
        <span key={file}>{getCharacter(Number(file))}</span>
      ))}
    </div>
  );
}
