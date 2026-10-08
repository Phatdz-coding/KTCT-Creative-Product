import {
  ArrowDown,
  ArrowRight,
  BriefcaseBusiness,
  Coffee,
  Coins,
  Handshake,
  MessageCircleQuestion,
  Play,
  Scale,
  Sparkles,
  Users,
} from "lucide-react";
import CoffeeShopScene from "./CoffeeShopScene";
import { baseline } from "../lib/economics";

const StartGame = ({ compact = false }: { compact?: boolean }) => (
  <a className={`lp-start${compact ? " compact" : ""}`} href="#game">
    <Play size={compact ? 16 : 19} fill="currentColor" aria-hidden="true" />
    Bắt đầu ca làm Barista
    {!compact && <ArrowRight size={19} aria-hidden="true" />}
  </a>
);

export default function LandingPage() {
  return (
    <div className="landing-page">
      <a className="skip-link" href="#noi-dung">
        Đến nội dung chính
      </a>
      <header className="lp-nav">
        <a className="lp-brand" href="#top" aria-label="Coffee & Society — đầu trang">
          <span><Coffee size={22} aria-hidden="true" /></span>
          <strong>Coffee <i>&</i> Society</strong>
        </a>
        <nav aria-label="Nội dung bài thuyết trình">
          <a href="#hop-tac">01. Hợp tác</a>
          <a href="#ban-chat">02. Bản chất</a>
          <a href="#ket-luan">03. Kết luận</a>
        </nav>
        <StartGame compact />
      </header>

      <main id="noi-dung" tabIndex={-1}>
        <section className="lp-hero" id="top">
          <div className="lp-hero-copy">
            <span className="lp-kicker"><Sparkles size={15} aria-hidden="true" /> KINH TẾ CHÍNH TRỊ · CHƯƠNG 01</span>
            <h1>
              Một ca làm việc.<br />
              <em>Hai cách nhìn.</em>
            </h1>
            <p className="lp-question">Hợp tác hay bóc lột?</p>
            <p className="lp-lead">
              Nhà tư bản đầu tư vốn và cơ sở vật chất. Người lao động bán sức
              lao động để nhận lương. Đây là một thỏa thuận đôi bên cùng có lợi
              — hay còn điều gì ẩn sau mỗi ly cà phê?
            </p>
            <div className="lp-hero-actions">
              <a className="lp-explore" href="#hop-tac">
                Khám phá câu chuyện <ArrowDown size={18} aria-hidden="true" />
              </a>
              <StartGame />
            </div>
          </div>

          <div className="lp-hero-visual">
            <div className="lp-scene-label">
              <span>● ĐANG QUAN SÁT</span>
              <strong>CA SÁNG · 08:00–16:00</strong>
            </div>
            <CoffeeShopScene
              running={false}
              hours={8}
              cups={120}
              scenario={baseline}
            />
            <div className="lp-scene-note">120 ly cà phê · 3 barista · 8 giờ</div>
          </div>
        </section>

        <section className="lp-opening" aria-labelledby="opening-title">
          <span className="lp-section-no">0</span>
          <div>
            <span className="lp-kicker">ĐẶT VẤN ĐỀ</span>
            <h2 id="opening-title">Một giao dịch tưởng như rất đơn giản</h2>
            <p>
              Nhân viên góp thời gian và kỹ năng. Doanh nghiệp trả lương, cung
              cấp công cụ và chịu rủi ro. Nhưng khi một dự án tiền tỷ được tạo
              ra từ mức lương cố định, phần chênh lệch thuộc về ai?
            </p>
          </div>
          <blockquote>
            “Thuận mua vừa bán” có đủ để giải thích toàn bộ quan hệ lao động?
          </blockquote>
        </section>

        <section className="lp-chapter lp-cooperation" id="hop-tac" aria-labelledby="cooperation-title">
          <div className="lp-chapter-head">
            <span className="lp-section-no">1</span>
            <div>
              <span className="lp-kicker"><Handshake size={15} aria-hidden="true" /> GÓC NHÌN THỨ NHẤT</span>
              <h2 id="cooperation-title">Hợp tác <em>— hiện tượng bề ngoài</em></h2>
              <p>Doanh nghiệp như một cỗ máy: nhiều nguồn lực cùng vận hành để tạo ra giá trị kinh tế.</p>
            </div>
          </div>

          <div className="lp-partners">
            <article>
              <span className="lp-icon"><BriefcaseBusiness aria-hidden="true" /></span>
              <small>NHÀ ĐẦU TƯ</small>
              <h3>Vốn & rủi ro</h3>
              <p>Mặt bằng, máy móc, nguyên liệu và chi phí vận hành.</p>
            </article>
            <span className="lp-plus" aria-hidden="true">+</span>
            <article>
              <span className="lp-icon"><Users aria-hidden="true" /></span>
              <small>NGƯỜI LAO ĐỘNG</small>
              <h3>Sức lao động</h3>
              <p>Thời gian, kỹ năng và năng suất trong suốt ca làm.</p>
            </article>
            <span className="lp-equals" aria-hidden="true">=</span>
            <article className="highlight">
              <span className="lp-icon"><Coffee aria-hidden="true" /></span>
              <small>KẾT QUẢ</small>
              <h3>120 ly cà phê</h3>
              <p>Sản phẩm được bán và tạo ra một dòng tiền liên tục.</p>
            </article>
          </div>

          <div className="lp-ledger" aria-label="Kết quả bề mặt của ca làm">
            <div><span>Doanh thu</span><strong>6.000.000 đ</strong><small>120 ly × 50.000 đ</small></div>
            <span aria-hidden="true">−</span>
            <div><span>Tổng chi phí</span><strong>3.120.000 đ</strong><small>Nguyên liệu, vận hành, lương</small></div>
            <span aria-hidden="true">=</span>
            <div className="surplus"><span>Giá trị còn lại</span><strong>2.880.000 đ</strong><small>Kết quả sau một ca</small></div>
          </div>
          <p className="lp-thesis"><Scale size={21} aria-hidden="true" /> Ở bề mặt thị trường, đây là một trao đổi tự nguyện và hợp pháp: mỗi bên đều nhận được điều mình đã thỏa thuận.</p>
        </section>

        <section className="lp-turn" aria-label="Chuyển góc nhìn">
          <span>NHƯNG NẾU TA NHÌN VÀO BÊN TRONG CA LÀM?</span>
          <ArrowDown size={24} aria-hidden="true" />
        </section>

        <section className="lp-chapter lp-essence" id="ban-chat" aria-labelledby="essence-title">
          <div className="lp-chapter-head">
            <span className="lp-section-no">2</span>
            <div>
              <span className="lp-kicker"><Coins size={15} aria-hidden="true" /> GÓC NHÌN KINH TẾ CHÍNH TRỊ</span>
              <h2 id="essence-title">Bóc tách <em>bản chất bên trong</em></h2>
              <p>Theo C. Mác, một ca làm việc chứa hai khoảng thời gian có ý nghĩa hoàn toàn khác nhau.</p>
            </div>
          </div>

          <div className="lp-time-card">
            <div className="lp-time-head"><strong>Một ca làm, hai khoảng thời gian</strong><span>08:00 — 16:00</span></div>
            <div className="lp-timeline" aria-label="1 giờ 36 phút lao động tất yếu và 6 giờ 24 phút lao động thặng dư">
              <div><strong>01:36</strong><span>Lao động tất yếu</span></div>
              <div><strong>06:24</strong><span>Lao động thặng dư</span></div>
            </div>
            <div className="lp-time-copy">
              <p><b><i className="necessary" /> Lao động tất yếu</b>Thời gian tạo ra lượng giá trị đủ bù lại tiền lương 720.000 đ.</p>
              <p><b><i className="extra" /> Lao động thặng dư</b>Thời gian tiếp tục tạo ra giá trị vượt quá phần tương ứng với tiền lương.</p>
            </div>
          </div>

          <div className="lp-formula-wrap">
            <div>
              <span className="lp-kicker">CÔNG THỨC GIÁ TRỊ HÀNG HÓA</span>
              <h3>Giá trị mới được phân chia như thế nào?</h3>
              <p>Máy móc và nguyên liệu chuyển giá trị sẵn có vào sản phẩm. Sức lao động tạo ra giá trị mới, gồm tiền lương và giá trị thặng dư.</p>
            </div>
            <div className="lp-formula" aria-label="W bằng c cộng v cộng m">
              <div><b>W</b><span>Giá trị sản phẩm</span><strong>6.000.000 đ</strong></div>
              <i>=</i>
              <div><b>c</b><span>Tư bản bất biến</span><strong>2.400.000 đ</strong></div>
              <i>+</i>
              <div><b>v</b><span>Tư bản khả biến</span><strong>720.000 đ</strong></div>
              <i>+</i>
              <div className="m"><b>m</b><span>Giá trị thặng dư</span><strong>2.880.000 đ</strong></div>
            </div>
          </div>

          <blockquote className="lp-core-claim">
            <span>LUẬN ĐIỂM CỐT LÕI</span>
            Lợi nhuận không tự sinh ra từ máy móc hay vốn. Trong mô hình này,
            nó xuất hiện từ phần giá trị thặng dư do sức lao động tạo ra nhưng
            không được hoàn trả dưới dạng tiền lương.
          </blockquote>
        </section>

        <section className="lp-conclusion" id="ket-luan" aria-labelledby="conclusion-title">
          <div className="lp-conclusion-copy">
            <span className="lp-section-no">3</span>
            <span className="lp-kicker">TỔNG KẾT</span>
            <h2 id="conclusion-title">Hai góc nhìn.<br />Một quan hệ kinh tế.</h2>
            <div className="lp-compare">
              <p><span>VỎ BỌC</span><strong>Sự hợp tác</strong>Thỏa thuận hợp pháp trên thị trường.</p>
              <p><span>LÕI BÊN TRONG</span><strong>Sự chiếm đoạt</strong>Tư bản tăng trưởng qua lao động thặng dư.</p>
            </div>
          </div>
          <div className="lp-qa">
            <MessageCircleQuestion size={38} aria-hidden="true" />
            <span>THẢO LUẬN · Q&amp;A</span>
            <h3>Hiểu cơ chế này giúp gì cho người lao động?</h3>
            <p>Khi đàm phán lương, thời gian làm việc và quyền lợi trong doanh nghiệp hiện đại?</p>
          </div>
        </section>

        <section className="lp-final-cta" aria-labelledby="cta-title">
          <span className="lp-kicker">ĐẾN LƯỢT BẠN QUAN SÁT</span>
          <h2 id="cta-title">Đừng chỉ nghe lý thuyết.<br /><em>Hãy tự chạy một ca làm.</em></h2>
          <p>Điều chỉnh điều kiện, theo dõi từng ly cà phê và khám phá điểm mà lao động bắt đầu tạo ra giá trị thặng dư.</p>
          <StartGame />
        </section>
      </main>

      <footer className="lp-footer">
        <span><Coffee size={16} aria-hidden="true" /> COFFEE &amp; SOCIETY</span>
        <p>Mô hình giáo dục đơn giản hóa · Quan sát. Đặt câu hỏi. Khám phá.</p>
      </footer>
    </div>
  );
}
