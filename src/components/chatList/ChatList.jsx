
import { Link } from "react-router-dom";
import "./chatList.css"; // Pastikan path ini benar
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react"; // Import useAuth

const ChatList = () => {
  // Dapatkan status autentikasi dari Clerk
  const { isSignedIn, isLoaded } = useAuth();

        const { isPending, error, data } = useQuery({
          queryKey: ["userChats"],
          queryFn: () =>
            fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
              credentials: "include",
              headers: {
                'Cache-Control': 'no-cache',
              }
            }).then((res) => {
              if (!res.ok) {
                 throw new Error(`HTTP error! status: ${res.status}`);
              }
              return res.json();
            }),
          // Aktifkan query hanya jika Clerk selesai memuat DAN pengguna masuk
          enabled: isLoaded && !!isSignedIn,
        });

        // Perbarui UI saat loading atau belum dimuat
        if (!isLoaded) {
            return <div>Loading authentication state...</div>;
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
