jsx
import { Link } from "react-router-dom";
import "./chatList.css"; // Pastikan path ini benar
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react"; // Import useAuth

const ChatList = () => {
  // Dapatkan status autentikasi dari Clerk
  const { isSignedIn } = useAuth();

  // Gunakan useQuery untuk mengambil data, hanya jika pengguna telah masuk
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"], // Kunci unik untuk query ini
    queryFn: () =>
      // Fungsi untuk melakukan fetching data
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include", // Penting untuk mengirim cookies Clerk
        headers: {
          'Cache-Control': 'no-cache', // Menonaktifkan cache browser
        }
      }).then((res) => {
        // Periksa jika respons bukan OK (status 2xx)
        if (!res.ok) {
           // Lempar error jika status bukan OK (misalnya, 401 Unauthorized)
           // Catatan: 302 ditangani otomatis oleh browser/fetch API,
           // tetapi ini membantu menangani error non-302.
           throw new Error(`HTTP error! status: ${res.status}`);
        }
        // Parse respons sebagai JSON
        return res.json();
      }),
    // Opsi 'enabled': Query hanya akan berjalan jika kondisi ini true
    // !!isSignedIn mengubah nilai truthy/falsy menjadi boolean murni
    enabled: !!isSignedIn,
  });

  // Fungsi helper untuk merender konten daftar obrolan
  const renderChatListContent = () => {
    // Tampilkan pesan jika pengguna belum masuk
    if (!isSignedIn) {
      return <p>Please sign in to see your recent chats.</p>;
    }

    // Tampilkan pesan loading saat query sedang berjalan
    if (isPending) {
      return "Loading...";
    }

    // Tampilkan pesan error jika ada kesalahan saat fetching
    if (error) {
      console.error("Error fetching user chats:", error); // Log error untuk debugging
      return "Something went wrong!";
    }

    // Tampilkan pesan jika tidak ada obrolan atau data kosong
    if (!data || data.length === 0) {
      return <p>No recent chats.</p>;
    }

    // Render daftar obrolan jika data tersedia
    return data.map((chat) => (
      <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
        {chat.title || "Untitled Chat"} {/* Tampilkan judul atau default */}
      </Link>
    ));
  };


  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      {/* Link untuk membuat obrolan baru (ini tidak perlu dicek auth di sini) */}
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore ALPHADEV AI</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {/* Render konten daftar obrolan berdasarkan status */}
        {renderChatListContent()}
      </div>
      <hr />
      {/* Bagian upgrade (tidak terkait langsung dengan bug 302) */}
      <div className="upgrade">
        <img src="/logo.png" alt="" /> {/* Pastikan path gambar benar */}
        <div className="texts">
          <span>Upgrade to ALPHADEV AI Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
