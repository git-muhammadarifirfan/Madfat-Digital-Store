import React, { useState, useCallback, useMemo } from 'react';
import { X, Trash2, ShoppingBag, Send, AlertCircle, ShoppingCart, Plus, Minus, FileText } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onUpdateNotes: (productId: string, notes: string) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onUpdateNotes,
  onRemoveItem,
  onClearCart,
}: CartProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'remove' | 'clear';
    itemId?: string;
    itemName?: string;
  }>({
    isOpen: false,
    type: 'remove'
  });

  const totalAmount = useMemo(
    () => cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    ),
    [cartItems]
  );

  const formatPrice = useCallback((value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const handleCheckout = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      setValidationError('Silakan masukkan Nama Lengkap dan Email Anda untuk checkout.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      setValidationError('Silakan masukkan alamat Email yang valid.');
      return;
    }
    setValidationError('');

    const adminWhatsAppNumber = '6281234567890';
    const dateStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

    let message = `*HALO TEH OLI, SAYA MAU ORDER!* ⚡\n`;
    message += `===============================\n`;
    message += `*Detail Pelanggan:*\n`;
    message += `👤 Nama Lengkap: ${customerName.trim()}\n`;
    message += `📧 Email Penerima: ${customerEmail.trim()}\n`;
    message += `📅 Tanggal Pemesanan: ${dateStr} WIB\n`;
    message += `===============================\n\n`;
    message += `*Daftar Produk Pesanan:*\n`;

    cartItems.forEach((item, index) => {
      const typeLabel = 'features' in item.product ? 'Website' : 'Akun Digital';
      message += `${index + 1}. *${item.product.name}* [${typeLabel}]\n`;
      message += `   • Jumlah: ${item.quantity}x\n`;
      message += `   • Harga Satuan: ${formatPrice(item.product.price)}\n`;
      if (item.notes.trim()) {
        message += `   • Catatan: _"${item.notes.trim()}"_\n`;
      }
      message += `   • Subtotal: ${formatPrice(item.product.price * item.quantity)}\n\n`;
    });

    message += `===============================\n`;
    message += `*TOTAL PEMBAYARAN:* *${formatPrice(totalAmount)}*\n`;
    message += `===============================\n\n`;
    message += `Mohon segera diproses ya admin Madfat. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  }, [cartItems, customerName, customerEmail, totalAmount, formatPrice]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-obsidian z-90 cursor-pointer transition-opacity duration-300 ${
          isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-surface z-100 shadow-2xl flex flex-col border-l-4 border-obsidian transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 bg-cream-warm border-b-2 border-obsidian flex justify-between items-center relative">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blaze-orange" />
            <h2 className="font-hero text-xl font-bold text-obsidian uppercase tracking-wide">
              Keranjangmu
            </h2>
            {cartItems.length > 0 && (
              <span className="ml-1 bg-obsidian text-white text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full border-2 border-obsidian bg-white hover:bg-blaze-orange hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 noise-overlay bg-surface">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
              <div className="w-20 h-20 bg-cream-warm rounded-full border-2 border-obsidian flex items-center justify-center brutalist-shadow">
                <ShoppingBag className="w-10 h-10 text-blaze-orange" />
              </div>
              <div>
                <h3 className="font-hero text-lg font-bold text-obsidian">Keranjang Kosong</h3>
                <p className="text-sm text-on-surface-variant max-w-xs mt-1">
                  Kamu belum memilih layanan premium atau bundle website apa pun. Yuk belanja dulu!
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  window.history.pushState({}, '', '/produk');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="px-6 py-2 bg-blaze-orange text-white rounded-full font-tag text-xs font-bold border-2 border-obsidian alert-btn"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 bg-white border-2 border-obsidian rounded-xl brutalist-shadow-gold flex flex-col space-y-3 relative"
                >
                  {/* Product Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cream-warm border border-obsidian flex items-center justify-center font-tag text-xs font-black text-blaze-orange">
                        {item.product.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-hero text-sm font-bold text-obsidian line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-tag font-tag text-xs font-bold text-blaze-orange italic">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setConfirmModal({ isOpen: true, type: 'remove', itemId: item.product.id, itemName: item.product.name })}
                      className="text-on-surface-variant hover:text-red-500 transition-colors p-1 cursor-pointer"
                      title="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between pt-1 border-t border-dashed border-sand-gold/30">
                    <div className="flex items-center border-2 border-obsidian rounded-lg bg-surface overflow-hidden">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            setConfirmModal({ isOpen: true, type: 'remove', itemId: item.product.id, itemName: item.product.name });
                          } else {
                            onUpdateQuantity(item.product.id, item.quantity - 1);
                          }
                        }}
                        className="px-2 py-1 bg-cream-warm hover:bg-blaze-orange hover:text-white transition-colors cursor-pointer border-r border-obsidian"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 font-mono text-xs font-black select-none text-obsidian">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 bg-cream-warm hover:bg-blaze-orange hover:text-white transition-colors cursor-pointer border-l border-obsidian"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-tag text-xs font-extrabold text-obsidian italic">
                      Sbtl: {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>

                  {/* Notes / Catatan Input */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 font-tag text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                      <FileText className="w-3 h-3 text-blaze-orange" />
                      Catatan (Email login / Deskripsi Custom):
                    </label>
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => onUpdateNotes(item.product.id, e.target.value)}
                      placeholder="Contoh: user@email.com / request tema gelap"
                      className="w-full text-xs px-2.5 py-1.5 border border-sand-gold bg-surface-container-lowest text-obsidian rounded focus:outline-none focus:border-blaze-orange transition-colors"
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setConfirmModal({ isOpen: true, type: 'clear' })}
                  className="font-tag text-[10px] text-on-surface-variant hover:text-red-500 font-bold underline transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Details Form */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t-4 border-obsidian space-y-4">
            <div className="flex justify-between items-center font-tag font-black">
              <span className="text-sm text-obsidian uppercase">TOTAL TRANSFER</span>
              <span className="text-xl text-blaze-orange font-hero italic">
                {formatPrice(totalAmount)}
              </span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="block font-tag text-[10px] font-black text-obsidian uppercase">
                  NAMA LENGKAP:
                </label>
                <input
                  required
                  type="text"
                  placeholder="Masukkan nama Anda..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-obsidian rounded-xl bg-surface focus:outline-none focus:bg-cream-warm/30 focus:border-blaze-orange transition-all duration-200"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-tag text-[10px] font-black text-obsidian uppercase">
                  EMAIL PENERIMA:
                </label>
                <input
                  required
                  type="email"
                  placeholder="contoh: budi@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-obsidian rounded-xl bg-surface focus:outline-none focus:bg-cream-warm/30 focus:border-blaze-orange transition-all duration-200"
                />
              </div>

              {validationError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-start gap-1.5 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-blaze-orange text-white rounded-full font-tag text-xs font-black tracking-wide brutalist-shadow-dark border-2 border-obsidian hover:translate-y-[-2px] hover:bg-[#FF7A30] duration-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>KIRIM VIA WHATSAPP</span>
                <Send className="w-4 h-4 fill-current" />
              </button>

              <p className="text-[10px] text-center text-on-surface-variant font-medium leading-tight">
                *Pesanan akan diproses Kak Admin 5-15 menit setelah order diteruskan to WhatsApp!
              </p>
            </form>
          </div>
        )}
      </div>

      {/* Confirmation Modal Overlay */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-obsidian/75 z-[99999] flex items-center justify-center p-6">
          <div className="bg-[#fff8f2] border-3 border-obsidian rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-[5px_5px_0px_0px_#FF7A30] text-center select-none animate-slide-up-fade">
            <h3 className="font-hero text-base sm:text-lg font-black text-obsidian uppercase mb-3">
              APAKAH ANDA YAKIN?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5F5B57] mb-6 leading-relaxed">
              {confirmModal.type === 'clear' 
                ? 'Apakah Anda yakin ingin mengosongkan semua daftar pesanan di keranjang belanja Anda?'
                : `Apakah Anda yakin ingin menghapus "${confirmModal.itemName}" dari daftar belanja Anda?`}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  if (confirmModal.type === 'clear') {
                    onClearCart();
                  } else if (confirmModal.itemId) {
                    onRemoveItem(confirmModal.itemId);
                  }
                  setConfirmModal({ isOpen: false, type: 'remove' });
                }}
                className="px-5 py-2.5 bg-[#ba1a1a] text-white rounded-xl border-2 border-obsidian font-tag text-xs font-bold shadow-[2px_2px_0px_0px_#1C1E1C] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1C1E1C] transition-all cursor-pointer uppercase"
              >
                {confirmModal.type === 'clear' ? 'YA, KOSONGKAN' : 'YA, HAPUS'}
              </button>
              <button
                onClick={() => setConfirmModal({ isOpen: false, type: 'remove' })}
                className="px-5 py-2.5 bg-white text-obsidian rounded-xl border-2 border-obsidian font-tag text-xs font-bold shadow-[2px_2px_0px_0px_#1C1E1C] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1C1E1C] transition-all cursor-pointer uppercase"
              >
                BATAL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(Cart);
