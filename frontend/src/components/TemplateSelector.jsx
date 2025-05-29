import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TemplateSelector({ setSelectedImage }) {
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data.data.memes);
      });
  }, []);

  const handleTemplateSelect = (url) => {
    setSelectedImage(url);
    navigate("/editor"); 
  };

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
<div>
  <div className="flex items-center gap-4 mb-2 flex-wrap">
    <h3 className="text-xl font-semibold">Choose a Template:</h3>
    <input
      type="text"
      placeholder="Search templates..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="p-2 border border-gray-300 rounded-md w-64"
    />
  </div>

  <p className="text-sm text-gray-500 mb-4">
    Showing top 50 templates. Use the search template to find others.
  </p>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {filteredTemplates.slice(0, 50).map((template) => (
      <div
        key={template.id}
        className="rounded-md border-2 p-2 flex flex-col items-center"
      >
        <img
          src={template.url}
          alt={template.name}
          title={template.name}
          className="rounded-md max-h-40 object-contain mb-2 cursor-pointer"
          onClick={() => handleTemplateSelect(template.url)}
        />
        <p className="text-center text-sm font-medium mb-2">{template.name}</p>
        <button
          onClick={() => handleTemplateSelect(template.url)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
        >
          Use This Template
        </button>
      </div>
    ))}
  </div>
</div>


  );
}

export default TemplateSelector;
