// lib/i18n.ts
import type { Locale } from '@/app/store/useLanguageStore'

type TranslationValue = {
    th: string
    en: string
    jp: string
}

const translations: Record<string, TranslationValue> = {
    // ============ Navbar ============
    'nav.home': { th: 'หน้าแรก', en: 'Home', jp: 'ホーム' },
    'nav.buildPC': { th: 'จัดสเปคคอม', en: 'PC Builder', jp: 'PC組み立て' },
    'nav.warranty': { th: 'การรับประกัน', en: 'Warranty', jp: '保証' },
    'nav.contact': { th: 'ติดต่อเรา', en: 'Contact Us', jp: 'お問い合わせ' },
    'nav.about': { th: 'เกี่ยวกับเรา', en: 'About Us', jp: '私たちについて' },
    'nav.login': { th: 'เข้าสู่ระบบ', en: 'Log in', jp: 'ログイン' },
    'nav.admin': { th: 'แอดมิน', en: 'ADMIN', jp: '管理者' },

    // ============ Categories ============
    'cat.all': { th: 'สินค้าทั้งหมด', en: 'All Products', jp: '全商品' },
    'cat.cpu': { th: 'โปรเซสเซอร์', en: 'Processors', jp: 'プロセッサ' },
    'cat.motherboard': { th: 'เมนบอร์ด', en: 'Motherboards', jp: 'マザーボード' },
    'cat.gpu': { th: 'การ์ดจอ', en: 'Graphics Cards', jp: 'グラフィックカード' },
    'cat.ram': { th: 'แรม', en: 'Memory', jp: 'メモリ' },
    'cat.storage': { th: 'อุปกรณ์จัดเก็บข้อมูล', en: 'Storage', jp: 'ストレージ' },
    'cat.psu': { th: 'พาวเวอร์ซัพพลาย', en: 'Power Supply', jp: '電源ユニット' },
    'cat.case': { th: 'เคส', en: 'Cases', jp: 'ケース' },
    'cat.cooler': { th: 'ระบบระบายความร้อน', en: 'Cooling', jp: '冷却' },
    'cat.monitor': { th: 'จอมอนิเตอร์', en: 'Monitors', jp: 'モニター' },
    'cat.laptop': { th: 'แล็ปท็อป', en: 'Laptops', jp: 'ノートPC' },
    'cat.mouse': { th: 'เมาส์', en: 'Mice', jp: 'マウス' },
    'cat.keyboard': { th: 'คีย์บอร์ด', en: 'Keyboards', jp: 'キーボード' },
    'cat.headset': { th: 'หูฟัง', en: 'Audio', jp: 'オーディオ' },
    'cat.chair': { th: 'เฟอร์นิเจอร์', en: 'Furniture', jp: '家具' },

    // ============ Main Content ============
    'main.categories': { th: 'หมวดหมู่', en: 'Categories', jp: 'カテゴリー' },
    'main.selectedForYou': { th: 'คัดสรรมาเพื่อคุณ', en: 'Selected for You', jp: 'おすすめ商品' },
    'main.searchResults': { th: 'ผลการค้นหา', en: 'Search results for', jp: '検索結果' },
    'main.products': { th: 'สินค้า', en: 'Products', jp: '商品' },
    'main.noProducts': { th: 'ไม่พบสินค้าที่ตรงกับตัวกรอง', en: 'No products found matching your filters.', jp: 'フィルターに一致する商品が見つかりません' },
    'main.clearFilters': { th: 'ล้างตัวกรอง', en: 'Clear Filters', jp: 'フィルターをクリア' },

    // ============ News Section ============
    'news.title': { th: 'ข่าวสาร & รีวิวจากผู้เชี่ยวชาญ', en: 'News & Expert Reviews', jp: 'ニュース＆専門レビュー' },
    'news.readMore': { th: 'อ่านเพิ่มเติม', en: 'Read more', jp: '続きを読む' },

    // ============ Store Features ============
    'feat.warranty.title': { th: 'รับประกันอย่างเป็นทางการ', en: 'Official Warranty', jp: '公式保証' },
    'feat.warranty.desc': { th: 'สินค้าแท้ 100% รับประกันศูนย์ไทยทุกชิ้น', en: '100% authentic products with official Thai warranty', jp: '100%正規品、タイ公式保証付き' },
    'feat.delivery.title': { th: 'จัดส่งรวดเร็ว', en: 'Fast Delivery', jp: '迅速配送' },
    'feat.delivery.desc': { th: 'จัดส่งฟรีทั่วประเทศ ถึงมือภายใน 1-2 วัน', en: 'Free nationwide delivery within 1-2 days', jp: '全国送料無料、1〜2日でお届け' },
    'feat.assembly.title': { th: 'ประกอบโดยผู้เชี่ยวชาญ', en: 'Expert Assembly', jp: 'エキスパート組立' },
    'feat.assembly.desc': { th: 'บริการประกอบคอมฯ โดยช่างมืออาชีพ', en: 'PC assembly by professional technicians', jp: 'プロの技術者によるPC組立' },
    'feat.support.title': { th: 'สนับสนุน 24/7', en: '24/7 Support', jp: '24時間サポート' },
    'feat.support.desc': { th: 'ให้คำปรึกษาจัดสเปคฟรี ตลอด 24 ชม.', en: 'Free spec consultation 24/7', jp: '24時間無料スペック相談' },

    // ============ FAQ ============
    'faq.title': { th: 'คำถามที่พบบ่อย', en: 'FAQ', jp: 'よくある質問' },
    'faq.subtitle': { th: '& เกร็ดความรู้', en: '& Tips', jp: '＆ヒント' },
    'faq.description': { th: 'ทุกข้อสงสัยเกี่ยวกับสินค้า การจัดส่ง และการประกอบคอมพิวเตอร์ เราเตรียมคำตอบไว้ให้คุณแล้วที่นี่', en: 'All your questions about products, shipping, and PC assembly answered right here', jp: '商品、配送、PC組立に関するすべての質問にお答えします' },
    'faq.helpCenter': { th: 'ศูนย์ช่วยเหลือ', en: 'Help Center', jp: 'ヘルプセンター' },
    'faq.notFound': { th: 'ไม่พบคำตอบที่ต้องการ?', en: "Can't find an answer?", jp: '答えが見つかりませんか？' },
    'faq.notFoundDesc': { th: 'ทีมแอดมินของเราพร้อมดูแลคุณผ่านช่องทาง Line และ Messenger ตลอดเวลาทำการ', en: 'Our team is ready to help you via Line and Messenger during business hours', jp: '営業時間中、LineとMessengerでサポートいたします' },
    'faq.contactStaff': { th: 'ติดต่อเจ้าหน้าที่', en: 'Contact Support', jp: 'サポートに連絡' },
    'faq.q1': { th: 'สินค้าที่สั่งจาก iHAVEGPU เป็นของแท้และมีประกันไหม?', en: 'Are products from iHAVEGPU authentic with warranty?', jp: 'iHAVEGPUの商品は正規品で保証付きですか？' },
    'faq.a1': { th: 'สินค้าทุกชิ้นเป็นของแท้ 100% มือหนึ่งแกะกล่อง และมีการรับประกันศูนย์ไทยตั้งแต่ 1-3 ปี (ขึ้นอยู่กับประเภทสินค้า) หากมีปัญหาภายใน 7 วันแรก ทางเรามีบริการเปลี่ยนตัวใหม่ให้ทันทีครับ', en: 'All products are 100% authentic, brand new, with 1-3 year official Thai warranty (depending on product type). Issues within the first 7 days qualify for immediate replacement.', jp: 'すべての商品は100%正規品・新品で、1〜3年のタイ公式保証付きです（商品タイプにより異なります）。最初の7日以内の問題は即時交換対応いたします。' },
    'faq.q2': { th: 'มีบริการประกอบคอมพิวเตอร์และจัดสายไฟให้ด้วยไหม?', en: 'Do you offer PC assembly and cable management?', jp: 'PC組立とケーブルマネジメントのサービスはありますか？' },
    'faq.a2': { th: 'เรามีบริการประกอบคอมพิวเตอร์โดยช่างมืออาชีพฟรี! พร้อมระบบการจัดสายไฟที่เน้นความสวยงามและการระบายอากาศที่ดีที่สุด (Cable Management) ก่อนส่งมอบเรามีการทดสอบ Stress Test ทุกเครื่องครับ', en: 'We offer free PC assembly by professional technicians with premium cable management for optimal aesthetics and airflow. Every system is stress-tested before delivery.', jp: 'プロの技術者による無料PC組立サービスを提供しています。最適な見た目とエアフローのためのプレミアムケーブルマネジメント付き。出荷前に全システムをストレステスト済みです。' },
    'faq.q3': { th: 'ใช้เวลานานแค่ไหนในการจัดส่งสินค้า?', en: 'How long does shipping take?', jp: '配送にどのくらいかかりますか？' },
    'faq.a3': { th: 'สำหรับการสั่งซื้ออุปกรณ์แยกชิ้น จะใช้เวลา 1-2 วันทำการ หากเป็นเครื่องประกอบเสร็จ จะใช้เวลา 2-3 วันทำการ (รวมเวลาประกอบและทดสอบระบบ) เราจัดส่งฟรีทั่วประเทศโดยขนส่งเอกชนชั้นนำครับ', en: 'Individual components ship within 1-2 business days. Pre-built systems take 2-3 business days (including assembly and testing). Free nationwide shipping via premium courier.', jp: '単品パーツは1〜2営業日で出荷。組立済みシステムは2〜3営業日（組立・テスト含む）。全国送料無料で配送いたします。' },
    'faq.q4': { th: 'มีระบบผ่อนชำระผ่านบัตรเครดิตไหม?', en: 'Do you offer credit card installment plans?', jp: 'クレジットカードの分割払いはできますか？' },
    'faq.a4': { th: 'มีครับ เรายินดีรับชำระผ่านบัตรเครดิตและมีโปรโมชั่นผ่อน 0% นานสูงสุด 10 เดือน กับธนาคารชั้นนำที่ร่วมรายการ รวมถึงรองรับการชำระผ่านทาง QR Code และการโอนเงินผ่านธนาคาร', en: 'Yes! We accept credit cards with 0% installment plans up to 10 months from leading banks. We also accept QR Code and bank transfer payments.', jp: 'はい！主要銀行の最大10ヶ月0%分割払いに対応しています。QRコード支払いと銀行振込も受け付けています。' },
    'faq.q5': { th: 'จะเลือก Power Supply (PSU) อย่างไรให้เพียงพอต่อสเปค?', en: 'How to choose the right Power Supply (PSU)?', jp: '適切な電源ユニット（PSU）の選び方は？' },
    'faq.a5': { th: 'หลักการง่ายๆ คือการนำวัตต์ของ CPU และ GPU มารวมกันแล้วบวกเผื่อไว้อีกประมาณ 150-200W หรือใช้ระบบจัดสเปคหน้าเว็บของเราที่จะคำนวณวัตต์ที่แนะนำให้โดยอัตโนมัติครับ', en: 'Simply add the wattage of your CPU and GPU, then add 150-200W headroom. Or use our online PC Builder which automatically calculates the recommended wattage.', jp: 'CPUとGPUのワット数を合計し、150〜200Wの余裕を加えてください。または、推奨ワット数を自動計算するオンラインPCビルダーをご利用ください。' },
    'faq.q6': { th: "ปัญหา 'คอขวด' (Bottleneck) คืออะไร?", en: "What is a 'Bottleneck'?", jp: '「ボトルネック」とは何ですか？' },
    'faq.a6': { th: 'คือสภาวะที่อุปกรณ์ชิ้นหนึ่งแรงเกินไปจนอีกชิ้นทำงานตามไม่ทัน เช่น ใช้การ์ดจอตัวท็อปแต่ใช้ CPU รุ่นต่ำเกินไป ทำให้การ์ดจอทำงานได้ไม่เต็มประสิทธิภาพ แนะนำให้เลือกสเปคที่สมดุลกันครับ', en: "It's when one component is too powerful for another to keep up — for example, a top-tier GPU paired with a low-end CPU. This limits the GPU's full potential. We recommend balanced specs.", jp: '一方のパーツが強すぎてもう一方が追いつけない状態です。例えば、ハイエンドGPUとローエンドCPUの組み合わせ。GPUの性能を十分に発揮できません。バランスの取れたスペックをお勧めします。' },
    'faq.q7': { th: 'iHAVEGPU มีหน้าร้านอยู่ที่ไหนบ้าง?', en: 'Where are iHAVEGPU stores located?', jp: 'iHAVEGPUの店舗はどこにありますか？' },
    'faq.a7': { th: 'ปัจจุบันเรามีสำนักงานใหญ่และสาขาครอบคลุมหลายพื้นที่ เช่น กรุงเทพฯ (รามอินทรา), ปทุมธานี และนครนายก ลูกค้าสามารถเลือกมารับสินค้าเองที่สาขาหรือเข้ามาปรึกษาการจัดสเปคได้โดยตรงครับ', en: 'We have our headquarters and branches in multiple locations including Bangkok (Ram Intra), Pathum Thani, and Nakhon Nayok. You can pick up orders or visit for spec consultation.', jp: 'バンコク（ラームイントラ）、パトゥムターニー、ナコーンナーヨックなど複数の拠点があります。店頭受取やスペック相談にご来店いただけます。' },
    'faq.q8': { th: 'ทางร้านรับติดตั้ง Windows และโปรแกรมต่างๆ ไหม?', en: 'Do you install Windows and software?', jp: 'Windowsやソフトウェアのインストールは行っていますか？' },
    'faq.a8': { th: 'เรามีบริการติดตั้ง Windows 11 Home/Pro (ลิขสิทธิ์แท้) และลง Driver พื้นฐานให้พร้อมใช้งานทันทีเมื่อเครื่องถึงมือลูกค้า ส่วนโปรแกรมลิขสิทธิ์อื่นๆ สามารถปรึกษาทีมงานเพิ่มเติมได้ครับ', en: 'We offer licensed Windows 11 Home/Pro installation with basic drivers pre-configured. For other licensed software, please consult our team.', jp: 'ライセンス版Windows 11 Home/Proのインストールと基本ドライバーの事前設定を行います。その他のライセンスソフトについてはチームにご相談ください。' },
    'faq.q9': { th: 'ถ้าต้องการเปลี่ยนสเปคหลังจากสั่งซื้อไปแล้วทำได้ไหม?', en: 'Can I change specs after placing an order?', jp: '注文後にスペック変更はできますか？' },
    'faq.a9': { th: 'หากออเดอร์ยังไม่อยู่ในขั้นตอนการประกอบ ลูกค้าสามารถติดต่อแอดมินเพื่อแจ้งเปลี่ยนอุปกรณ์ได้ครับ แต่หากประกอบเสร็จแล้วอาจมีค่าธรรมเนียมในการรื้อถอนและแก้ไขเล็กน้อย', en: 'If your order hasn\'t entered the assembly stage, you can contact admin to change components. If already assembled, a small disassembly fee may apply.', jp: '組立段階に入っていない場合は、管理者に連絡してパーツ変更が可能です。組立済みの場合、解体手数料がかかる場合があります。' },
    'faq.q10': { th: 'ติดต่อฝ่ายเทคนิคหลังการขายได้ช่องทางไหน?', en: 'How to contact after-sales technical support?', jp: 'アフターサポートへの連絡方法は？' },
    'faq.a10': { th: 'ลูกค้าสามารถติดต่อทีม Support ได้ผ่านทาง Line OA: @ihavegpu หรือโทรติดต่อ Call Center ของสาขาที่สั่งซื้อได้ตลอดเวลาทำการ เรายินดีดูแลจนกว่าปัญหาจะแก้ไขได้ครับ', en: 'Contact our Support team via Line OA: @ihavegpu or call the branch where you ordered during business hours. We\'ll help until your issue is resolved.', jp: 'Line OA: @ihavegpuまたはご注文された店舗のコールセンターにご連絡ください。問題解決までサポートいたします。' },

    // ============ Footer ============
    'footer.desc': { th: 'ร้านอุปกรณ์คอมพิวเตอร์ระดับ Hi-End สำหรับ Gamers และ Creators เราคัดสรรเฉพาะสินค้าคุณภาพ ของแท้ 100% พร้อมบริการหลังการขายที่คุณวางใจได้', en: 'Hi-End computer hardware store for Gamers and Creators. We curate only quality, 100% authentic products with after-sales service you can trust.', jp: 'ゲーマーとクリエイターのためのハイエンドPC機器ストア。品質の高い100%正規品のみを厳選し、信頼のアフターサービスをお届けします。' },
    'footer.shop': { th: 'ร้านค้า', en: 'Shop', jp: 'ショップ' },
    'footer.support': { th: 'สนับสนุน', en: 'Support', jp: 'サポート' },
    'footer.contact': { th: 'ติดต่อ', en: 'Contact', jp: '連絡先' },
    'footer.graphicsCards': { th: 'การ์ดจอ', en: 'Graphics Cards', jp: 'グラフィックカード' },
    'footer.processors': { th: 'โปรเซสเซอร์', en: 'Processors', jp: 'プロセッサ' },
    'footer.motherboards': { th: 'เมนบอร์ด', en: 'Motherboards', jp: 'マザーボード' },
    'footer.casesCooling': { th: 'เคส & ระบบระบายความร้อน', en: 'Cases & Cooling', jp: 'ケース＆冷却' },
    'footer.gamingLaptops': { th: 'แล็ปท็อปเกมมิ่ง', en: 'Gaming Laptops', jp: 'ゲーミングノートPC' },
    'footer.orderStatus': { th: 'สถานะคำสั่งซื้อ', en: 'Order Status', jp: '注文状況' },
    'footer.warrantyReturns': { th: 'การรับประกัน & คืนสินค้า', en: 'Warranty & Returns', jp: '保証＆返品' },
    'footer.shippingInfo': { th: 'ข้อมูลการจัดส่ง', en: 'Shipping Info', jp: '配送情報' },
    'footer.faq': { th: 'คำถามที่พบบ่อย', en: 'FAQ', jp: 'よくある質問' },
    'footer.contactUs': { th: 'ติดต่อเรา', en: 'Contact Us', jp: 'お問い合わせ' },
    'footer.privacyPolicy': { th: 'นโยบายความเป็นส่วนตัว', en: 'Privacy Policy', jp: 'プライバシーポリシー' },
    'footer.terms': { th: 'เงื่อนไขการให้บริการ', en: 'Terms of Service', jp: '利用規約' },
    'footer.copyright': { th: '© 2026 iHAVEGPU Store สงวนลิขสิทธิ์', en: '© 2026 iHAVEGPU Store. All rights reserved.', jp: '© 2026 iHAVEGPU Store. All rights reserved.' },

    // ============ Search ============
    'search.placeholder': { th: 'ค้นหาสินค้า...', en: 'Search products...', jp: '商品を検索...' },

    // ============ Meta ============
    'meta.description': { th: 'ร้านอุปกรณ์คอมพิวเตอร์ครบวงจร', en: 'Complete computer hardware store', jp: '総合PCパーツストア' },

    // ============ Admin ============
    'admin.panel': { th: 'แผงควบคุม', en: 'Panel', jp: 'パネル' },
    'admin.dashboard': { th: 'Dashboard', en: 'Dashboard', jp: 'ダッシュボード' },
    'admin.finance': { th: 'การเงิน', en: 'Finance', jp: '財務' },
    'admin.products': { th: 'สินค้า', en: 'Products', jp: '商品' },
    'admin.orders': { th: 'คำสั่งซื้อ', en: 'Orders', jp: '注文' },
    'admin.chat': { th: 'แชทลูกค้า', en: 'Customer Chat', jp: '顧客チャット' },
    'admin.backToStore': { th: 'กลับหน้าร้าน', en: 'Back to Store', jp: 'ストアに戻る' },
    'admin.logout': { th: 'ออกจากระบบ', en: 'Sign Out', jp: 'ログアウト' },
    'admin.dashboardTitle': { th: 'ภาพรวมระบบ', en: 'System Overview', jp: 'システム概要' },
    'admin.dashboardDesc': { th: 'สรุปข้อมูลร้านค้าและสิ่งที่ต้องทำวันนี้', en: 'Store summary and today\'s action items', jp: 'ストアの概要と本日のアクション' },
    'admin.pendingSlip': { th: 'รอตรวจสลิป', en: 'Pending Slips', jp: 'スリップ確認待ち' },
    'admin.actionRequired': { th: 'ต้องดำเนินการทันที', en: 'Action Required', jp: '要対応' },
    'admin.toShip': { th: 'รอจัดส่งสินค้า', en: 'Ready to Ship', jp: '発送待ち' },
    'admin.readyToShip': { th: 'พร้อมส่ง', en: 'Ready', jp: '準備完了' },
    'admin.lowStock': { th: 'สินค้าใกล้หมด', en: 'Low Stock', jp: '在庫僅少' },
    'admin.restockNow': { th: 'เติมสต็อกด่วน', en: 'Restock Now', jp: '今すぐ補充' },
    'admin.totalRevenue': { th: 'รายได้รวมทั้งหมด', en: 'Total Revenue', jp: '総収益' },
    'admin.totalOrders': { th: 'คำสั่งซื้อทั้งหมด', en: 'Total Orders', jp: '注文総数' },
    'admin.totalProducts': { th: 'สินค้าทั้งหมด', en: 'Total Products', jp: '商品総数' },

    // Admin Products
    'admin.manageProducts': { th: 'จัดการสินค้า', en: 'Manage Products', jp: '商品管理' },
    'admin.allProducts': { th: 'สินค้าทั้งหมด', en: 'Total Products', jp: '全商品' },
    'admin.items': { th: 'รายการ', en: 'items', jp: '件' },
    'admin.addProduct': { th: 'เพิ่มสินค้าใหม่', en: 'Add Product', jp: '新商品追加' },
    'admin.searchProducts': { th: 'ค้นหาชื่อสินค้า...', en: 'Search products...', jp: '商品名で検索...' },
    'admin.image': { th: 'รูปภาพ', en: 'Image', jp: '画像' },
    'admin.productName': { th: 'ชื่อสินค้า', en: 'Product Name', jp: '商品名' },
    'admin.category': { th: 'หมวดหมู่', en: 'Category', jp: 'カテゴリー' },
    'admin.price': { th: 'ราคา', en: 'Price', jp: '価格' },
    'admin.stock': { th: 'สต็อก', en: 'Stock', jp: '在庫' },
    'admin.manage': { th: 'จัดการ', en: 'Actions', jp: '操作' },
    'admin.pieces': { th: 'ชิ้น', en: 'pcs', jp: '個' },
    'admin.noProducts': { th: 'ไม่พบสินค้าที่ค้นหา', en: 'No products found', jp: '商品が見つかりません' },

    // Admin Orders
    'admin.manageOrders': { th: 'จัดการคำสั่งซื้อ', en: 'Manage Orders', jp: '注文管理' },
    'admin.orderId': { th: 'รหัสออเดอร์', en: 'Order ID', jp: '注文ID' },
    'admin.customer': { th: 'ลูกค้า', en: 'Customer', jp: '顧客' },
    'admin.total': { th: 'ยอดรวม', en: 'Total', jp: '合計' },
    'admin.status': { th: 'สถานะ', en: 'Status', jp: 'ステータス' },
    'admin.proof': { th: 'หลักฐานโอน', en: 'Payment Proof', jp: '支払い証明' },
    'admin.tracking': { th: 'เลขพัสดุ', en: 'Tracking', jp: '追跡番号' },
    'admin.viewSlip': { th: 'ดูสลิป', en: 'View Slip', jp: 'スリップ表示' },
    'admin.details': { th: 'รายละเอียด', en: 'Details', jp: '詳細' },
    'admin.confirm': { th: 'ยืนยัน', en: 'Confirm', jp: '確認' },
    'admin.reject': { th: 'ปฏิเสธ', en: 'Reject', jp: '拒否' },
    'admin.ship': { th: 'จัดส่งสินค้า', en: 'Ship Order', jp: '発送する' },
    'admin.editTracking': { th: 'แก้ไขเลข', en: 'Edit Tracking', jp: '追跡番号編集' },
    'admin.noOrders': { th: 'ไม่พบรายการคำสั่งซื้อ', en: 'No orders found', jp: '注文が見つかりません' },

    // Admin Finance
    'admin.financeDashboard': { th: 'แดชบอร์ดการเงิน', en: 'Finance Dashboard', jp: '財務ダッシュボード' },
    'admin.analyzeRevenue': { th: 'วิเคราะห์รายได้และยอดขาย', en: 'Analyze revenue and sales', jp: '収益と売上を分析' },
    'admin.totalIncome': { th: 'รายรับรวม', en: 'Total Income', jp: '総収入' },
    'admin.paidOrders': { th: 'ออเดอร์ที่ชำระแล้ว', en: 'Paid Orders', jp: '支払い済み注文' },
    'admin.avgOrder': { th: 'ยอดเฉลี่ย/ออเดอร์', en: 'Avg. Order Value', jp: '平均注文額' },
    'admin.revenueTrends': { th: 'แนวโน้มรายได้', en: 'Revenue Trends', jp: '収益トレンド' },
    'admin.recentTx': { th: 'รายการล่าสุด', en: 'Recent Transactions', jp: '最近の取引' },
    'admin.date': { th: 'วันที่', en: 'Date', jp: '日付' },
    'admin.amount': { th: 'ยอดเงิน', en: 'Amount', jp: '金額' },

    // Admin Chat
    'admin.customerChat': { th: 'แชทลูกค้า', en: 'Customer Chat', jp: '顧客チャット' },
    'admin.selectChat': { th: 'เลือกรายการแชททางซ้ายมือ', en: 'Select a chat from the left panel', jp: '左パネルからチャットを選択してください' },
    'admin.typeReply': { th: 'พิมพ์ข้อความตอบกลับ...', en: 'Type a reply...', jp: '返信を入力...' },

    // Admin Breadcrumb
    'admin.bread.home': { th: 'หน้าแรก', en: 'Home', jp: 'ホーム' },
    'admin.bread.admin': { th: 'Admin', en: 'Admin', jp: '管理' },
    'admin.bread.finance': { th: 'การเงิน', en: 'Finance', jp: '財務' },
    'admin.bread.products': { th: 'สินค้า', en: 'Products', jp: '商品' },
    'admin.bread.orders': { th: 'คำสั่งซื้อ', en: 'Orders', jp: '注文' },
    'admin.bread.chat': { th: 'แชทลูกค้า', en: 'Customer Chat', jp: '顧客チャット' },
    'admin.bread.add': { th: 'เพิ่มรายการ', en: 'Add Item', jp: '追加' },
    'admin.bread.edit': { th: 'แก้ไข', en: 'Edit', jp: '編集' },

    // Status Labels
    'status.all': { th: 'ทั้งหมด', en: 'All', jp: 'すべて' },
    'status.pending': { th: 'รอชำระเงิน', en: 'Pending', jp: '支払い待ち' },
    'status.verifying': { th: 'รอตรวจสอบ', en: 'Verifying', jp: '確認中' },
    'status.paid': { th: 'ชำระแล้ว', en: 'Paid', jp: '支払い済み' },
    'status.shipped': { th: 'จัดส่งแล้ว', en: 'Shipped', jp: '発送済み' },
    'status.cancelled': { th: 'ยกเลิก', en: 'Cancelled', jp: 'キャンセル' },
    'status.completed': { th: 'สำเร็จ', en: 'Completed', jp: '完了' },
    'status.paymentFailed': { th: 'ชำระเงินไม่สำเร็จ', en: 'Payment Failed', jp: '支払い失敗' },

    // ============ Login ============
    'login.title': { th: 'เข้าสู่ระบบ', en: 'Login', jp: 'ログイン' },
    'login.subtitle': { th: 'กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ', en: 'Please sign in to continue', jp: 'ログインして続行してください' },
    'login.email': { th: 'อีเมล', en: 'Email', jp: 'メールアドレス' },
    'login.password': { th: 'รหัสผ่าน', en: 'Password', jp: 'パスワード' },
    'login.forgotPassword': { th: 'ลืมรหัสผ่าน?', en: 'Forgot password?', jp: 'パスワードをお忘れですか？' },
    'login.submit': { th: 'เข้าสู่ระบบ', en: 'Sign In', jp: 'ログイン' },
    'login.noAccount': { th: 'ยังไม่มีบัญชีสมาชิก?', en: 'Don\'t have an account?', jp: 'アカウントをお持ちでないですか？' },
    'login.register': { th: 'สมัครสมาชิก', en: 'Register', jp: '新規登録' },
    'login.guest': { th: 'เข้าใช้งานแบบ Guest (ไม่ล็อกอิน)', en: 'Continue as Guest', jp: 'ゲストとして続行' },
    'login.errorInvalid': { th: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', en: 'Invalid email or password', jp: 'メールアドレスまたはパスワードが正しくありません' },
    'login.success': { th: 'เข้าสู่ระบบสำเร็จ', en: 'Login successful', jp: 'ログイン成功' },
    'login.error': { th: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', en: 'Login error occurred', jp: 'ログインエラーが発生しました' },

    // ============ Register ============
    'register.title': { th: 'สร้างบัญชีใหม่', en: 'Create Account', jp: 'アカウント作成' },
    'register.subtitle': { th: 'สมัครสมาชิกเพื่อเริ่มต้นใช้งาน', en: 'Register to get started', jp: '新規登録して利用を開始' },
    'register.displayName': { th: 'ชื่อที่แสดง', en: 'Display Name', jp: '表示名' },
    'register.submit': { th: 'สมัครสมาชิก', en: 'Register', jp: '登録する' },
    'register.hasAccount': { th: 'มีบัญชีอยู่แล้ว?', en: 'Already have an account?', jp: 'すでにアカウントをお持ちですか？' },
    'register.login': { th: 'เข้าสู่ระบบ', en: 'Sign In', jp: 'ログイン' },
    'register.success': { th: 'สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน', en: 'Registration successful! Please sign in.', jp: '登録完了！ログインしてください。' },
    'register.error': { th: 'สมัครสมาชิกไม่สำเร็จ', en: 'Registration failed', jp: '登録に失敗しました' },

    // ============ Cart ============
    'cart.title': { th: 'ตะกร้าสินค้า', en: 'Shopping Cart', jp: 'ショッピングカート' },
    'cart.home': { th: 'หน้าแรก', en: 'Home', jp: 'ホーム' },
    'cart.empty': { th: 'ตะกร้าสินค้าว่างเปล่า', en: 'Your cart is empty', jp: 'カートは空です' },
    'cart.emptyDesc': { th: 'คุณยังไม่ได้เลือกสินค้าที่ถูกใจเลย', en: 'You haven\'t added any items yet', jp: 'まだ商品が追加されていません' },
    'cart.goShopping': { th: 'ไปเลือกซื้อสินค้า', en: 'Start Shopping', jp: 'ショッピングを始める' },
    'cart.orderSummary': { th: 'สรุปคำสั่งซื้อ', en: 'Order Summary', jp: '注文概要' },
    'cart.subtotal': { th: 'ยอดรวมสินค้า', en: 'Subtotal', jp: '小計' },
    'cart.shipping': { th: 'ค่าจัดส่ง', en: 'Shipping', jp: '送料' },
    'cart.free': { th: 'ฟรี', en: 'Free', jp: '無料' },
    'cart.freeAbove': { th: 'ช้อปครบ 5,000 ส่งฟรี', en: 'Free shipping above ฿5,000', jp: '5,000バーツ以上送料無料' },
    'cart.total': { th: 'ยอดชำระทั้งหมด', en: 'Total', jp: '合計' },
    'cart.taxIncluded': { th: 'รวมภาษีมูลค่าเพิ่มแล้ว', en: 'Tax included', jp: '税込み' },
    'cart.shippingAddress': { th: 'ที่อยู่จัดส่ง', en: 'Shipping Address', jp: '配送先住所' },
    'cart.addAddress': { th: 'กรุณาเพิ่มที่อยู่จัดส่ง', en: 'Please add a shipping address', jp: '配送先住所を追加してください' },
    'cart.taxInvoice': { th: 'ขอใบกำกับภาษีเต็มรูป', en: 'Request full tax invoice', jp: '税請求書を希望する' },
    'cart.taxId': { th: 'เลขประจำตัวผู้เสียภาษี (13 หลัก)', en: 'Tax ID (13 digits)', jp: '納税者番号（13桁）' },
    'cart.taxName': { th: 'ชื่อบริษัท / ชื่อบุคคล', en: 'Company / Individual Name', jp: '会社名/個人名' },
    'cart.taxAddress': { th: 'ที่อยู่สำหรับออกใบกำกับภาษี', en: 'Tax invoice address', jp: '税請求書の住所' },
    'cart.checkout': { th: 'ชำระเงิน', en: 'Checkout', jp: '決済する' },
    'cart.processing': { th: 'กำลังดำเนินการ...', en: 'Processing...', jp: '処理中...' },
    'cart.securePayment': { th: 'ปลอดภัยด้วยระบบชำระเงินมาตรฐาน', en: 'Secure payment system', jp: '安全な決済システム' },
    'cart.removed': { th: 'ลบสินค้าเรียบร้อย', en: 'Item removed', jp: '商品を削除しました' },
    'cart.loginRequired': { th: 'กรุณาเข้าสู่ระบบก่อนชำระเงิน', en: 'Please login before checkout', jp: '決済前にログインしてください' },
    'cart.needAddress': { th: 'กรุณาเพิ่มที่อยู่จัดส่งก่อน', en: 'Please add shipping address first', jp: '配送先住所を先に追加してください' },
    'cart.orderSuccess': { th: 'สั่งซื้อสำเร็จ!', en: 'Order placed!', jp: '注文完了！' },
    'cart.orderError': { th: 'สั่งซื้อไม่สำเร็จ', en: 'Order failed', jp: '注文失敗' },
    'cart.connectionError': { th: 'เกิดข้อผิดพลาดในการเชื่อมต่อ', en: 'Connection error', jp: '接続エラー' },

    // ============ Testimonials ============
    'testimonials.subtitle': { th: 'เสียงระดับโลก', en: 'World-Class Voices', jp: 'ワールドクラスの声' },
    'testimonials.title': { th: 'ความประทับใจจากลูกค้าของเรา', en: 'What Our Customers Say', jp: 'お客様の声' },

    // ============ Profile ============
    'profile.loginRequired': { th: 'กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์', en: 'Please login to view your profile', jp: 'プロフィールを表示するにはログインしてください' },
    'profile.login': { th: 'เข้าสู่ระบบ', en: 'Sign In', jp: 'ログイン' },
    'profile.breadcrumbHome': { th: 'หน้าแรก', en: 'Home', jp: 'ホーム' },
    'profile.breadcrumbAccount': { th: 'บัญชีของฉัน', en: 'My Account', jp: 'マイアカウント' },
    'profile.tabInfo': { th: 'ข้อมูลส่วนตัว', en: 'Personal Info', jp: '個人情報' },
    'profile.tabAddress': { th: 'ที่อยู่จัดส่ง', en: 'Shipping Addresses', jp: '配送先住所' },
    'profile.tabOrders': { th: 'ประวัติคำสั่งซื้อ', en: 'Order History', jp: '注文履歴' },
    'profile.tabFavorites': { th: 'สินค้าที่ถูกใจ', en: 'Wishlist', jp: 'お気に入り' },
    'profile.name': { th: 'ชื่อ - นามสกุล', en: 'Full Name', jp: '氏名' },
    'profile.email': { th: 'อีเมล', en: 'Email', jp: 'メール' },
    'profile.phone': { th: 'เบอร์โทรศัพท์', en: 'Phone Number', jp: '電話番号' },
    'profile.save': { th: 'บันทึกข้อมูล', en: 'Save Changes', jp: '保存' },
    'profile.addAddress': { th: 'เพิ่มที่อยู่ใหม่', en: 'Add New Address', jp: '新しい住所を追加' },
    'profile.addressLabel': { th: 'ที่อยู่ (บ้านเลขที่, หมู่, ซอย, ถนน)', en: 'Address (House No., Village, Soi, Road)', jp: '住所（番地、村、通り）' },
    'profile.district': { th: 'แขวง/ตำบล', en: 'Sub-district', jp: '地区' },
    'profile.amphoe': { th: 'เขต/อำเภอ', en: 'District', jp: '区' },
    'profile.province': { th: 'จังหวัด', en: 'Province', jp: '都道府県' },
    'profile.zipcode': { th: 'รหัสไปรษณีย์', en: 'Zip Code', jp: '郵便番号' },
    'profile.saveAddress': { th: 'บันทึกที่อยู่', en: 'Save Address', jp: '住所を保存' },
    'profile.setDefault': { th: 'ตั้งเป็นที่อยู่หลัก', en: 'Set as Default', jp: 'デフォルトに設定' },
    'profile.default': { th: 'ที่อยู่หลัก', en: 'Default', jp: 'デフォルト' },
    'profile.noOrders': { th: 'ยังไม่มีคำสั่งซื้อ', en: 'No orders yet', jp: 'まだ注文がありません' },
    'profile.noFavorites': { th: 'ยังไม่มีสินค้าที่ถูกใจ', en: 'No favorite items yet', jp: 'お気に入りはまだありません' },

    // ============ Favorites ============
    'favorites.loginRequired': { th: 'กรุณาเข้าสู่ระบบ', en: 'Please Sign In', jp: 'ログインしてください' },
    'favorites.loginDesc': { th: 'คุณต้องล็อกอินก่อนเพื่อดูรายการสินค้าที่ถูกใจ', en: 'You need to sign in to view your wishlist', jp: 'ウィッシュリストを表示するにはログインが必要です' },
    'favorites.login': { th: 'เข้าสู่ระบบ', en: 'Sign In', jp: 'ログイン' },
    'favorites.breadcrumbHome': { th: 'หน้าแรก', en: 'Home', jp: 'ホーム' },
    'favorites.breadcrumbFav': { th: 'สินค้าที่ถูกใจ', en: 'Wishlist', jp: 'お気に入り' },
    'favorites.title': { th: 'My Wishlist', en: 'My Wishlist', jp: 'お気に入りリスト' },
    'favorites.items': { th: 'items', en: 'items', jp: '件' },
    'favorites.empty': { th: 'ยังไม่มีสินค้าที่ถูกใจ', en: 'No favorite items yet', jp: 'お気に入りはまだありません' },
    'favorites.emptyDesc': { th: 'บันทึกสินค้าที่คุณชอบไว้ที่นี่ เพื่อกลับมาดูหรือสั่งซื้อในภายหลัง', en: 'Save items you like here to revisit or purchase later', jp: 'お気に入り商品をここに保存して、後で確認・購入できます' },
    'favorites.goShopping': { th: 'ไปเลือกสินค้า', en: 'Start Shopping', jp: 'ショッピングを始める' },

    // ============ Builder ============
    'builder.breadcrumbHome': { th: 'หน้าแรก', en: 'Home', jp: 'ホーム' },
    'builder.breadcrumbTitle': { th: 'จัดสเปคคอมพิวเตอร์', en: 'PC Builder', jp: 'PCビルダー' },
    'builder.title': { th: 'PC BUILDER', en: 'PC BUILDER', jp: 'PCビルダー' },
    'builder.subtitle': { th: 'สร้างคอมพิวเตอร์ในฝันของคุณ พร้อมตรวจสอบความเข้ากันได้ของอุปกรณ์อัตโนมัติ', en: 'Build your dream PC with automatic compatibility checking', jp: '自動互換性チェック付きのドリームPC構築' },
    'builder.selectItem': { th: 'เลือกอุปกรณ์', en: 'Choose Part', jp: 'パーツ選択' },
    'builder.clickToSelect': { th: 'คลิกเพื่อเลือก', en: 'Click to select', jp: 'クリックして選択' },
    'builder.summary': { th: 'สรุปรายการจัดสเปค', en: 'Build Summary', jp: 'ビルドサマリー' },
    'builder.emptyState': { th: 'กรุณาเลือกอุปกรณ์เพื่อเริ่มจัดสเปค', en: 'Select parts to start building', jp: 'パーツを選択してビルドを開始' },
    'builder.total': { th: 'ยอดรวมสุทธิ', en: 'Total', jp: '合計' },
    'builder.orderNow': { th: 'สั่งซื้อชุดสเปคนี้', en: 'Order This Build', jp: 'このビルドを注文' },
    'builder.modalTitle': { th: 'เลือก', en: 'Choose', jp: '選択' },
    'builder.modalDesc': { th: 'ระบบจะแสดงเฉพาะสินค้าที่เข้ากันได้กับชุดคอมพิวเตอร์ของคุณ', en: 'Showing only compatible parts for your build', jp: 'ビルドに互換性のあるパーツのみ表示' },
    'builder.selectThis': { th: 'เลือกรายการนี้', en: 'Select This', jp: 'これを選択' },
    'builder.saveBuild': { th: 'บันทึกสเปค', en: 'Save Build', jp: 'ビルド保存' },
    'builder.saveSuccess': { th: 'บันทึกสเปคคอมลงในบัญชีเรียบร้อยแล้ว!', en: 'Build saved to your account!', jp: 'ビルドをアカウントに保存しました！' },
    'builder.saveLoginRequired': { th: 'กรุณาเข้าสู่ระบบก่อนบันทึกสเปค', en: 'Please login to save your build', jp: 'ビルドを保存するにはログインしてください' },
    'builder.addedToCart': { th: 'เพิ่มชุดสเปคลงในตะกร้าสินค้าแล้ว', en: 'Build added to cart!', jp: 'ビルドをカートに追加しました！' },

    // ============ Orders ============
    'orders.title': { th: 'คำสั่งซื้อของฉัน', en: 'My Orders', jp: 'マイオーダー' },
    'orders.breadcrumbHome': { th: 'หน้าแรก', en: 'Home', jp: 'ホーム' },
    'orders.breadcrumbOrders': { th: 'คำสั่งซื้อ', en: 'Orders', jp: '注文' },
    'orders.loginRequired': { th: 'กรุณาเข้าสู่ระบบ', en: 'Please Sign In', jp: 'ログインしてください' },
    'orders.loginDesc': { th: 'คุณต้องล็อกอินก่อนเพื่อดูคำสั่งซื้อ', en: 'You need to sign in to view your orders', jp: '注文を表示するにはログインが必要です' },
    'orders.empty': { th: 'ยังไม่มีคำสั่งซื้อ', en: 'No orders yet', jp: 'まだ注文がありません' },
    'orders.emptyDesc': { th: 'เมื่อคุณสั่งซื้อสินค้า ประวัติจะแสดงที่นี่', en: 'Your order history will appear here', jp: '注文履歴はここに表示されます' },
    'orders.goShopping': { th: 'ไปเลือกซื้อสินค้า', en: 'Start Shopping', jp: 'ショッピングを始める' },
    'orders.total': { th: 'ยอดรวม', en: 'Total', jp: '合計' },
    'orders.trackingNumber': { th: 'เลขพัสดุ', en: 'Tracking Number', jp: '追跡番号' },
    'orders.uploadSlip': { th: 'แนบสลิปโอนเงิน', en: 'Upload Payment Slip', jp: '支払いスリップをアップロード' },
    'orders.trackPackage': { th: 'ติดตามพัสดุ', en: 'Track Package', jp: '配送を追跡' },
    'orders.details': { th: 'รายละเอียด', en: 'Details', jp: '詳細' },

    // ============ Order Success ============
    'orderSuccess.title': { th: 'สั่งซื้อสำเร็จแล้ว!', en: 'Order Placed!', jp: '注文完了！' },
    'orderSuccess.subtitle': { th: 'ขอบคุณที่สั่งซื้อกับเรา', en: 'Thank you for your order', jp: 'ご注文ありがとうございます' },
    'orderSuccess.orderId': { th: 'หมายเลขคำสั่งซื้อ', en: 'Order ID', jp: '注文番号' },
    'orderSuccess.date': { th: 'วันที่ทำรายการ', en: 'Order Date', jp: '注文日' },
    'orderSuccess.items': { th: 'รายการสินค้า', en: 'Items', jp: '商品' },
    'orderSuccess.shipping': { th: 'ข้อมูลการจัดส่ง', en: 'Shipping Info', jp: '配送情報' },
    'orderSuccess.payment': { th: 'การชำระเงิน', en: 'Payment', jp: 'お支払い' },
    'orderSuccess.delivery': { th: 'ข้อมูลการขนส่ง', en: 'Delivery Info', jp: '配送詳細' },
    'orderSuccess.total': { th: 'ยอดชำระทั้งหมด', en: 'Total Amount', jp: '合計金額' },
    'orderSuccess.backHome': { th: 'กลับหน้าแรก', en: 'Back to Home', jp: 'ホームに戻る' },
    'orderSuccess.viewOrders': { th: 'ดูคำสั่งซื้อ', en: 'View Orders', jp: '注文を見る' },

    // ============ About ============
    'about.title': { th: 'เกี่ยวกับเรา', en: 'About Us', jp: '私たちについて' },
    'about.subtitle': { th: 'ร้านอุปกรณ์คอมพิวเตอร์ครบวงจร', en: 'Your Complete PC Hardware Store', jp: '総合PCハードウェアストア' },
    'about.breadcrumbHome': { th: 'หน้าแรก', en: 'Home', jp: 'ホーム' },

    // ============ Contact ============
    'contact.title': { th: 'ติดต่อเรา', en: 'Contact Us', jp: 'お問い合わせ' },
    'contact.subtitle': { th: 'ต้องการความช่วยเหลือ? ทีมงานพร้อมตอบทุกคำถามของคุณ', en: 'Need help? Our team is ready to answer all your questions', jp: 'お困りですか？すべてのご質問にお答えします' },
    'contact.breadcrumbHome': { th: 'หน้าแรก', en: 'Home', jp: 'ホーム' },
    'contact.name': { th: 'ชื่อ - นามสกุล', en: 'Full Name', jp: '氏名' },
    'contact.email': { th: 'อีเมล', en: 'Email', jp: 'メール' },
    'contact.subject': { th: 'หัวข้อ', en: 'Subject', jp: '件名' },
    'contact.message': { th: 'รายละเอียด', en: 'Message', jp: 'メッセージ' },
    'contact.send': { th: 'ส่งข้อความ', en: 'Send Message', jp: 'メッセージを送信' },

    // ============ Warranty ============
    'warranty.title': { th: 'นโยบายการรับประกัน', en: 'Warranty Policy', jp: '保証ポリシー' },
    'warranty.breadcrumbHome': { th: 'หน้าแรก', en: 'Home', jp: 'ホーム' },

    // ============ Compare ============
    'compare.title': { th: 'เปรียบเทียบสินค้า', en: 'Compare Products', jp: '商品比較' },
    'compare.empty': { th: 'ยังไม่มีสินค้าให้เปรียบเทียบ', en: 'No products to compare', jp: '比較する商品がありません' },
    'compare.emptyDesc': { th: 'กรุณาเลือกสินค้าอย่างน้อย 2 ชิ้นจากหน้าร้าน', en: 'Please select at least 2 products from the store', jp: 'ストアから2つ以上の商品を選択してください' },
    'compare.goShopping': { th: 'ไปเลือกสินค้า', en: 'Go Shopping', jp: 'ショッピングへ' },
    'compare.remove': { th: 'นำออก', en: 'Remove', jp: '削除' },

    // ============ Product Detail ============
    'product.description': { th: 'รายละเอียด', en: 'Description', jp: '商品説明' },
    'product.specs': { th: 'สเปคสินค้า', en: 'Specifications', jp: '仕様' },
    'product.reviews': { th: 'รีวิวลูกค้า', en: 'Customer Reviews', jp: 'カスタマーレビュー' },
    'product.addToCart': { th: 'ใส่ตะกร้า', en: 'Add to Cart', jp: 'カートに追加' },
    'product.buyNow': { th: 'ซื้อเลย', en: 'Buy Now', jp: '今すぐ購入' },
    'product.freeShipping': { th: 'จัดส่งฟรีทั่วไทย เมื่อช้อปครบ 5,000.-', en: 'Free shipping on orders over ฿5,000', jp: '5,000バーツ以上送料無料' },
    'product.inStock': { th: 'มีสินค้า', en: 'In Stock', jp: '在庫あり' },
    'product.outOfStock': { th: 'สินค้าหมด', en: 'Out of Stock', jp: '在庫切れ' },
    'product.noDescription': { th: 'ไม่มีรายละเอียด', en: 'No description available', jp: '説明なし' },
    'product.noSpecs': { th: 'ไม่มีข้อมูลสเปค', en: 'No specifications available', jp: '仕様情報なし' },
    'product.noReviews': { th: 'ยังไม่มีรีวิว', en: 'No reviews yet', jp: 'レビューはまだありません' },
    'product.writeReview': { th: 'เขียนรีวิว', en: 'Write a Review', jp: 'レビューを書く' },
    'product.addedToCart': { th: 'เพิ่มสินค้าลงตะกร้าเรียบร้อย', en: 'Added to cart!', jp: 'カートに追加しました！' },
    'product.addToCartError': { th: 'เกิดข้อผิดพลาดในการหยิบใส่ตะกร้า', en: 'Error adding to cart', jp: 'カート追加エラー' },

    // ============ News Detail ============
    'news.backToNews': { th: 'กลับไปหน้าข่าว', en: 'Back to News', jp: 'ニュースに戻る' },
    'news.writtenBy': { th: 'เขียนโดย', en: 'Written by', jp: '著者' },
    'news.published': { th: 'เผยแพร่', en: 'Published', jp: '公開日' },
    'news.readTime': { th: 'เวลาอ่าน', en: 'Read Time', jp: '読了時間' },
    'news.relatedArticles': { th: 'บทความที่เกี่ยวข้อง', en: 'Related Articles', jp: '関連記事' },

    // ============ Forgot Password ============
    'forgotPassword.title': { th: 'ลืมรหัสผ่าน?', en: 'Forgot Password?', jp: 'パスワードをお忘れですか？' },
    'forgotPassword.subtitle': { th: 'กรอกอีเมลของคุณ แล้วเราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านให้', en: "Enter your email and we'll send you a reset link", jp: 'メールアドレスを入力すると、リセットリンクを送信します' },
    'forgotPassword.emailPlaceholder': { th: 'อีเมล', en: 'Email address', jp: 'メールアドレス' },
    'forgotPassword.submit': { th: 'ส่งลิงก์รีเซ็ต', en: 'Send Reset Link', jp: 'リセットリンクを送信' },
    'forgotPassword.sending': { th: 'กำลังส่ง...', en: 'Sending...', jp: '送信中...' },
    'forgotPassword.sent': { th: 'ตรวจสอบอีเมลของคุณ!', en: 'Check your email!', jp: 'メールを確認してください！' },
    'forgotPassword.sentDesc': { th: 'เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่', en: 'We have sent a password reset link to', jp: 'パスワードリセットリンクを送信しました' },
    'forgotPassword.backToLogin': { th: 'กลับหน้าเข้าสู่ระบบ', en: 'Back to Login', jp: 'ログインに戻る' },

    // ============ Reset Password ============
    'resetPassword.title': { th: 'ตั้งรหัสผ่านใหม่', en: 'Reset Password', jp: 'パスワードリセット' },
    'resetPassword.subtitle': { th: 'สร้างรหัสผ่านใหม่ที่ปลอดภัยสำหรับบัญชีของคุณ', en: 'Create a new strong password for your account', jp: 'アカウントの新しい安全なパスワードを作成' },
    'resetPassword.newPassword': { th: 'รหัสผ่านใหม่', en: 'New Password', jp: '新しいパスワード' },
    'resetPassword.confirmPassword': { th: 'ยืนยันรหัสผ่าน', en: 'Confirm Password', jp: 'パスワード確認' },
    'resetPassword.submit': { th: 'ตั้งรหัสผ่านใหม่', en: 'Set New Password', jp: '新しいパスワードを設定' },
    'resetPassword.resetting': { th: 'กำลังรีเซ็ต...', en: 'Resetting...', jp: 'リセット中...' },
    'resetPassword.success': { th: 'รีเซ็ตรหัสผ่านสำเร็จ!', en: 'Password Reset!', jp: 'パスワードリセット完了！' },
    'resetPassword.successDesc': { th: 'รหัสผ่านของคุณถูกอัปเดตเรียบร้อยแล้ว', en: 'Your password has been updated successfully', jp: 'パスワードが正常に更新されました' },
    'resetPassword.redirecting': { th: 'กำลังนำทางไปหน้าเข้าสู่ระบบ...', en: 'Redirecting to login...', jp: 'ログインページに移動中...' },
    'resetPassword.loginNow': { th: 'เข้าสู่ระบบ', en: 'Login Now', jp: '今すぐログイン' },
    'resetPassword.invalidLink': { th: 'ลิงก์ไม่ถูกต้อง กรุณาขอใหม่', en: 'Invalid Link. Please request a new one.', jp: '無効なリンクです。新しいリンクをリクエストしてください。' },
    'resetPassword.tryAgain': { th: 'ลองอีกครั้ง', en: 'Try again', jp: 'もう一度試す' },

    // ============ CustomerChat ============
    'chat.title': { th: 'ฝ่ายบริการลูกค้า', en: 'Customer Support', jp: 'カスタマーサポート' },
    'chat.contactUs': { th: 'ติดต่อเรา', en: 'Contact Us', jp: 'お問い合わせ' },
    'chat.placeholder': { th: 'พิมพ์ข้อความ...', en: 'Type a message...', jp: 'メッセージを入力...' },

    // ============ ProfileDropdown ============
    'profileDropdown.myAccount': { th: 'บัญชีของฉัน', en: 'My Account', jp: 'マイアカウント' },
    'profileDropdown.myOrders': { th: 'คำสั่งซื้อของฉัน', en: 'My Orders', jp: 'マイオーダー' },
    'profileDropdown.favorites': { th: 'รายการสินค้าโปรด', en: 'My Wishlist', jp: 'お気に入り' },
    'profileDropdown.admin': { th: 'ระบบหลังบ้าน', en: 'Admin Panel', jp: '管理パネル' },
    'profileDropdown.logout': { th: 'ออกจากระบบ', en: 'Sign Out', jp: 'ログアウト' },

    // ============ ProfileView (extra) ============
    'profile.account': { th: 'บัญชี', en: 'Account', jp: 'アカウント' },
    'profile.personalInfo': { th: 'ข้อมูลส่วนตัว', en: 'Personal Info', jp: '個人情報' },
    'profile.addressBook': { th: 'สมุดที่อยู่', en: 'Address Book', jp: '住所録' },
    'profile.orderHistory': { th: 'ประวัติสั่งซื้อ', en: 'Order History', jp: '注文履歴' },
    'profile.favItems': { th: 'สินค้าที่ชอบ', en: 'Favorites', jp: 'お気に入り' },
    'profile.birthday': { th: 'วันเกิด', en: 'Date of Birth', jp: '生年月日' },
    'profile.saving': { th: 'กำลังบันทึก...', en: 'Saving...', jp: '保存中...' },
    'profile.saveChanges': { th: 'บันทึกการเปลี่ยนแปลง', en: 'Save Changes', jp: '変更を保存' },
    'profile.addNewAddress': { th: 'เพิ่มที่อยู่จัดส่งใหม่', en: 'Add New Shipping Address', jp: '新しい配送先を追加' },
    'profile.recipientName': { th: 'ชื่อผู้รับ', en: 'Recipient Name', jp: '受取人名' },
    'profile.subdistrict': { th: 'แขวง / ตำบล', en: 'Sub-district', jp: '地区' },
    'profile.districtLabel': { th: 'เขต / อำเภอ', en: 'District', jp: '区' },
    'profile.defaultAddress': { th: 'ตั้งเป็นที่อยู่หลัก (Default)', en: 'Set as default address', jp: 'デフォルトに設定' },
    'profile.cancel': { th: 'ยกเลิก', en: 'Cancel', jp: 'キャンセル' },
    'profile.savingAddress': { th: 'บันทึก...', en: 'Saving...', jp: '保存中...' },
    'profile.noAddress': { th: 'ยังไม่มีที่อยู่จัดส่ง', en: 'No shipping addresses yet', jp: '配送先住所はまだありません' },
    'profile.deleteAddress': { th: 'ลบที่อยู่', en: 'Delete Address', jp: '住所を削除' },
    'profile.confirmDeleteAddress': { th: 'ยืนยันการลบที่อยู่', en: 'Confirm Delete Address', jp: '住所削除の確認' },
    'profile.confirmDeleteAddressMsg': { th: 'คุณต้องการลบที่อยู่นี้ใช่หรือไม่?', en: 'Are you sure you want to delete this address?', jp: 'この住所を削除しますか？' },
    'profile.items': { th: 'รายการ', en: 'items', jp: '件' },

    // ============ CompareFloatingBar ============
    'compare.list': { th: 'รายการเปรียบเทียบ', en: 'Compare List', jp: '比較リスト' },
    'compare.maxItems': { th: 'เลือกได้สูงสุด 3 รายการ', en: 'Select up to 3 items', jp: '最大3つ選択可能' },
    'compare.emptySlot': { th: 'ว่าง', en: 'Empty', jp: '空' },
    'compare.clearAll': { th: 'ล้างทั้งหมด', en: 'Clear All', jp: 'すべてクリア' },
    'compare.compareBtn': { th: 'เปรียบเทียบ', en: 'Compare', jp: '比較' },
    'compare.added': { th: '✓ เทียบแล้ว', en: '✓ Added', jp: '✓ 追加済み' },
    'compare.removedFromList': { th: 'ลบออกจากรายการเปรียบเทียบ', en: 'Removed from compare', jp: '比較リストから削除' },
    'compare.max3': { th: 'เปรียบเทียบได้สูงสุด 3 ชิ้น', en: 'Max 3 items to compare', jp: '比較は最大3つまで' },
    'compare.sameCategory': { th: 'สินค้าต้องอยู่ในหมวดเดียวกัน', en: 'Items must be in the same category', jp: '同じカテゴリの商品のみ比較可能' },
    'compare.addedToList': { th: 'เพิ่มลงรายการเปรียบเทียบ', en: 'Added to compare', jp: '比較リストに追加' },

    // ============ BuildSummaryBar ============
    'buildSummary.yourBuild': { th: 'สเปคของคุณ', en: 'Your Build', jp: 'あなたのビルド' },
    'buildSummary.totalPrice': { th: 'Total Price', en: 'Total Price', jp: '合計金額' },
    'buildSummary.processing': { th: 'กำลังดำเนินการ...', en: 'Processing...', jp: '処理中...' },
    'buildSummary.checkout': { th: 'สั่งซื้อ', en: 'Checkout', jp: '注文する' },
    'buildSummary.confirmTitle': { th: 'ยืนยันการสั่งซื้อ', en: 'Confirm Order', jp: '注文の確認' },
    'buildSummary.confirmMsg': { th: 'คุณต้องการดำเนินการต่อหรือไม่?', en: 'Do you want to proceed?', jp: '続行しますか？' },
    'buildSummary.pay': { th: 'ชำระเงิน', en: 'Pay Now', jp: '支払う' },
    'buildSummary.orderSuccess': { th: 'สั่งซื้อสำเร็จ!', en: 'Order placed!', jp: '注文完了！' },
    'buildSummary.orderError': { th: 'เกิดข้อผิดพลาด', en: 'An error occurred', jp: 'エラーが発生しました' },
    'buildSummary.connectionError': { th: 'เชื่อมต่อไม่ได้', en: 'Connection failed', jp: '接続失敗' },

    // ============ OrderStatusSelector ============
    'orderStatus.confirmTitle': { th: 'ยืนยันการเปลี่ยนสถานะ', en: 'Confirm Status Change', jp: 'ステータス変更の確認' },
    'orderStatus.confirmMsg': { th: 'คุณต้องการเปลี่ยนสถานะใช่หรือไม่?', en: 'Do you want to change the status?', jp: 'ステータスを変更しますか？' },
    'orderStatus.confirm': { th: 'ยืนยัน', en: 'Confirm', jp: '確認' },
    'orderStatus.success': { th: 'อัปเดตสถานะสำเร็จ', en: 'Status updated', jp: 'ステータスが更新されました' },
    'orderStatus.error': { th: 'อัปเดตไม่สำเร็จ', en: 'Update failed', jp: '更新に失敗しました' },

    // ============ ReviewForm ============
    'review.writeReview': { th: 'เขียนรีวิวสินค้า', en: 'Write a Review', jp: 'レビューを書く' },
    'review.yourReview': { th: 'เขียนรีวิวของคุณ', en: 'Write Your Review', jp: 'レビューを入力' },
    'review.cancel': { th: 'ยกเลิก', en: 'Cancel', jp: 'キャンセル' },
    'review.score': { th: 'คะแนน', en: 'score', jp: '点' },
    'review.placeholder': { th: 'เขียนความคิดเห็นของคุณ...', en: 'Write your comment...', jp: 'コメントを入力...' },
    'review.sending': { th: 'กำลังส่ง...', en: 'Sending...', jp: '送信中...' },
    'review.submit': { th: 'ส่งรีวิว', en: 'Submit Review', jp: 'レビューを送信' },
    'review.success': { th: 'ขอบคุณสำหรับรีวิวครับ! 🎉', en: 'Thank you for your review! 🎉', jp: 'レビューありがとうございます！🎉' },
    'review.error': { th: 'เกิดข้อผิดพลาด หรือคุณยังไม่ได้เข้าสู่ระบบ', en: 'Error occurred or you are not logged in', jp: 'エラーが発生しました。ログインしてください' },
    'review.connectionError': { th: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้', en: 'Cannot connect to server', jp: 'サーバーに接続できません' },
    'review.confirmTitle': { th: 'ยืนยันการส่งรีวิว', en: 'Confirm Review Submission', jp: 'レビュー送信の確認' },
    'review.confirmMsg': { th: 'คุณต้องการส่งรีวิวนี้ใช่หรือไม่?', en: 'Are you sure you want to submit this review?', jp: 'このレビューを送信しますか？' },

    // ============ FavoriteButton ============
    'favorite.loginRequired': { th: 'กรุณาเข้าสู่ระบบก่อนกดถูกใจ', en: 'Please sign in to add favorites', jp: 'お気に入りに追加するにはログインしてください' },

    // ============ NewsSection ============
    'newsSection.title': { th: 'วิดีโอรีวิวจากผู้เชี่ยวชาญ', en: 'Expert Video Reviews', jp: 'エキスパート動画レビュー' },
    'newsSection.featuredTitle': { th: 'รีวิวเจาะลึก: ประกอบคอมชุดน้ำเปิด งบไม่อั้น!', en: 'Deep Dive: Custom Open-Loop Watercooled PC Build!', jp: '徹底レビュー：オープンループ水冷PC構築！' },
    'newsSection.featuredDesc': { th: 'ชมขั้นตอนการประกอบสุดประณีต พร้อมเทคนิคการเดินท่อสวยๆ จากทีมงานมืออาชีพของ iHAVEGPU ที่จะช่วยให้คอมพิวเตอร์ของคุณโดดเด่นไม่เหมือนใคร', en: 'Watch the meticulous assembly process with premium tubing techniques from our professional team at iHAVEGPU', jp: 'iHAVEGPUプロチームによる丁寧な組立と美しい配管テクニックをご覧ください' },
    'newsSection.moreVideos': { th: 'วิดีโอแนะนำเพิ่มเติม', en: 'More Recommended Videos', jp: 'おすすめ動画' },
    'newsSection.viewAll': { th: 'ดูวิดีโอทั้งหมดบน YouTube', en: 'View All Videos on YouTube', jp: 'YouTubeで全動画を見る' },

    // ============ BrandMarquee ============
    'brand.subtitle': { th: 'พันธมิตรที่เชื่อถือได้', en: 'Trusted Partners', jp: '信頼のパートナー' },
    'brand.title': { th: 'ตัวแทนจำหน่ายอย่างเป็นทางการของแบรนด์ชั้นนำ', en: 'Official Distributor of Leading Brands', jp: '主要ブランドの正規販売代理店' },

    // ============ HeroCarousel ============
    'hero.badge': { th: 'Premium Selection', en: 'Premium Selection', jp: 'プレミアムセレクション' },
    'hero.slide1.title': { th: 'Welcome to iHAVEGPU', en: 'Welcome to iHAVEGPU', jp: 'iHAVEGPUへようこそ' },
    'hero.slide1.subtitle': { th: 'สินค้าคอมพิวเตอร์คุณภาพดีที่สุดสำหรับการจัดสเปคคอมในฝันของคุณ', en: 'Discover the best PC components and gaming gears for your ultimate setup.', jp: '最高のPCコンポーネントとゲーミングギアで究極のセットアップを。' },
    'hero.slide2.title': { th: 'High Performance', en: 'High Performance', jp: 'ハイパフォーマンス' },
    'hero.slide2.subtitle': { th: 'สัมผัสพลังของกราฟิกการ์ดและโปรเซสเซอร์แห่งอนาคต', en: 'Experience the power of next-gen graphics cards and processors.', jp: '次世代グラフィックカードとプロセッサのパワーを体験。' },
    'hero.slide3.title': { th: 'Unleash The Beast', en: 'Unleash The Beast', jp: 'ビーストを解き放て' },
    'hero.slide3.subtitle': { th: 'ครองทุกเกมด้วยสเปคคอมที่สร้างมาเพื่อชัยชนะ', en: 'Dominate every game with our extreme performance custom builds.', jp: '極限のパフォーマンスでゲームを制覇。' },

    // ============ Common / Shared ============
    'common.confirm': { th: 'ยืนยัน', en: 'Confirm', jp: '確認' },
    'common.cancel': { th: 'ยกเลิก', en: 'Cancel', jp: 'キャンセル' },
    'common.noImage': { th: 'ไม่มีรูป', en: 'No Image', jp: '画像なし' },
}

export function t(key: string, locale: Locale): string {
    const entry = translations[key]
    if (!entry) return key
    return entry[locale] || entry['th'] || key
}

export default translations
