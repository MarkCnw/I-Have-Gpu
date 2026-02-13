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
}

export function t(key: string, locale: Locale): string {
    const entry = translations[key]
    if (!entry) return key
    return entry[locale] || entry['th'] || key
}

export default translations
