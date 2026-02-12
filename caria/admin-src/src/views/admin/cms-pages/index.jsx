import React, { useEffect, useState } from "react";
import Card from "components/card";
import { MdDelete, MdEdit, MdAdd, MdVisibility } from "react-icons/md";
import { cmsBlockService } from "../../../api";

const CMSPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await cmsBlockService.getPages();
        setPages(res.data || []);
      } catch (err) {
        console.error('Error fetching CMS pages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const handleDelete = async (page) => {
    if (!window.confirm(`"${page.title}" sayfasını silmek istiyor musunuz?`)) return;
    try {
      await cmsBlockService.deletePage(page.id);
      setPages(pages.filter(p => p.id !== page.id));
    } catch (err) {
      console.error('Error deleting page:', err);
    }
  };

  return (
    <div className="mt-3">
      <Card extra="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy-700">CMS Sayfaları</h1>
            <p className="text-gray-500">Block tabanlı içerik sayfalarını yönetin</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
            <MdAdd /> Yeni Sayfa
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Yükleniyor...</div>
        ) : pages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">Henüz CMS sayfası yok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold text-gray-600">Başlık</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Slug</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Kategori</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Durum</th>
                  <th className="text-right p-3 font-semibold text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {pages.map(page => (
                  <tr key={page.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{page.title}</td>
                    <td className="p-3 text-gray-500">{page.slug}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">{page.category || 'general'}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-sm ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {page.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <a href={`/viewing-trip/${page.slug}`} target="_blank" rel="noreferrer"
                          className="p-2 hover:bg-gray-100 rounded text-gray-600"><MdVisibility /></a>
                        <button className="p-2 hover:bg-blue-100 rounded text-blue-600"><MdEdit /></button>
                        <button onClick={() => handleDelete(page)}
                          className="p-2 hover:bg-red-100 rounded text-red-600"><MdDelete /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CMSPages;
