import { useState } from "react";
import axios from "axios";

export default function App() {
  const [longUrl, setLongUrl] = useState("");
  const [urlList, setUrlList] = useState([]);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) return;

    try {
      const res = await axios.post("http://localhost:5000/api/shorten", {
        longUrl,
      });

      setUrlList((prev) => [
        ...prev,
        {
          longUrl,
          shortUrl: res.data.shortUrl,
          createdAt: new Date().toLocaleString(),
        },
      ]);
      setLongUrl("");
    } catch (err) {
      alert("Error shortening URL");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-4">URL Shortener</h1>

        <form onSubmit={handleShorten} className="flex gap-2 mb-6">
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter long URL"
            className="flex-1 p-2 border rounded"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Shorten
          </button>
        </form>

        {urlList.length > 0 && (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Long URL</th>
                <th className="p-2 border">Short URL</th>
                <th className="p-2 border">Created</th>
              </tr>
            </thead>
            <tbody>
              {urlList.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border break-all">{item.longUrl}</td>
                  <td className="p-2 border break-all text-blue-600 underline">
                    <a href={item.shortUrl} target="_blank" rel="noreferrer">
                      {item.shortUrl}
                    </a>
                  </td>
                  <td className="p-2 border">{item.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}