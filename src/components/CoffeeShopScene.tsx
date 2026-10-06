import { Coffee, Sun, Users } from "lucide-react";
import { calculate, clock, money, type Scenario } from "../lib/economics";
import {
  cafeTables,
  deliveryFrame,
  entranceFrame,
  tableVisitFrame,
} from "../lib/delivery";

type PersonProps = {
  x: number;
  y: number;
  shirt?: string;
  hair?: string;
  worker?: boolean;
  flip?: boolean;
  carrying?: boolean;
  tray?: boolean;
};
export function BaristaSprite({
  x,
  y,
  shirt = "#d9a451",
  hair = "#453028",
  worker = true,
  flip = false,
  carrying = false,
  tray = false,
}: PersonProps) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        className={worker ? "person worker" : "person customer"}
        style={{ transformOrigin: "16px 60px" }}
      >
        <g transform={flip ? "translate(32 0) scale(-1 1)" : undefined}>
          <path fill={hair} d="M8 0h20v5h5v20H3V8h5z" />
          <path fill="#e9b88b" d="M8 10h20v20H12v-5H8z" />
          <path fill={hair} d="M8 5h20v8H15v5H8z" />
          <path fill="#392d29" d="M24 17h3v3h-3z" />
          <path fill={shirt} d="M7 30h23v25H4V35h3z" />
          {worker && <path fill="#536b50" d="M12 30h4v9h10v-9h3v30H9V39h3z" />}
          <path fill="#3e3833" d="M9 57h9v20H7v-5h2zm12 0h9v20H20v-5h1z" />
          <path fill="#2d2724" d="M5 75h13v5H5zm14 0h13v5H19z" />
          <g className={worker ? "arm" : ""}>
            <path fill="#e9b88b" d="M27 35h7v15h-7z" />
            {(carrying || tray) && (
              <>
                <path fill="#4a3326" d="M26 44h48v4H26z" />
                {carrying && (
                  <>
                    <DrinkSprite x={36} y={29} />
                    <DrinkSprite x={56} y={29} />
                  </>
                )}
              </>
            )}
          </g>
        </g>
      </g>
    </g>
  );
}
export function CustomerSprite(props: PersonProps) {
  return <BaristaSprite {...props} worker={false} />;
}
export function DrinkSprite({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path fill="#fbedd1" d="M0 0h12v13H2V9H0z" />
      <path fill="#8c5837" d="M1 1h10v3H1z" />
      <path fill="none" stroke="#fbedd1" strokeWidth="3" d="M12 3h4v6h-4" />
    </g>
  );
}
export function OrderBubble({
  x,
  y,
  text,
}: {
  x: number;
  y: number;
  text: string;
}) {
  return (
    <g className="order-bubble" transform={`translate(${x} ${y})`}>
      <path
        d="M0 0h62v29H34l-7 8v-8H0z"
        fill="#fff4d7"
        stroke="#795436"
        strokeWidth="2"
      />
      <text x="31" y="20" textAnchor="middle" fontSize="14" fill="#63462d">
        {text}
      </text>
    </g>
  );
}
export function CoffeeMachine() {
  return (
    <g transform="translate(380 179)">
      <path fill="#3c514b" d="M0 8h95v66H0z" />
      <path fill="#b2b7a0" d="M5 0h85v10H5zM5 16h85v32H5z" />
      <path fill="#526b60" d="M9 20h77v18H9z" />
      <path
        className="machine-indicator"
        fill="#d4b374"
        d="M14 24h8v8h-8zm15 0h8v8h-8z"
      />
      <path fill="#292c29" d="M20 48h8v13h-8zm45 0h8v13h-8z" />
      <path fill="#d0c6a2" d="M4 70h87v6H4z" />
      <DrinkSprite x={18} y={59} />
      <DrinkSprite x={63} y={59} />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          className="steam"
          style={{ animationDelay: `${i * 0.6}s` }}
          d={`M${25 + i * 23} -4q-9 -10 0 -19t0 -19`}
          fill="none"
          stroke="#f9e9c9"
          strokeWidth="4"
        />
      ))}
    </g>
  );
}
function Plant({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        fill="#5c7549"
        d="M-3 0v-42h7V0zm0-28h-17v-9H-7v-9h7zm6 11h17v-12H10v-9H3zM-4-6h-18v-12h13v-6h5z"
      />
      <path fill="#b46f46" d="M-15 0h32l-4 27H-11z" />
      <path fill="#d59359" d="M-18-3h38v7h-38z" />
    </g>
  );
}
function Table({ x, y, served }: { x: number; y: number; served: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path fill="#684532" d="M-39 6h8v54h-8zm70 0h8v54h-8z" />
      <path
        fill="#b47a46"
        stroke="#694631"
        strokeWidth="3"
        d="M-48-4h96v17h-96z"
      />
      <path fill="#deb071" d="M-45-3h90v5h-90z" />
      {served && (
        <>
          <DrinkSprite x={-23} y={-18} />
          <DrinkSprite x={20} y={-18} />
        </>
      )}
      <path d="M-5 -16h13v12H-5z" fill="#d5c396" />
      <path d="M0 -16v-12h4v12m-4-7h-5v-5h5m4 2h5v-5h-5" fill="#657b4b" />
    </g>
  );
}
export default function CoffeeShopScene({
  running,
  hours,
  cups,
  scenario,
  speed = 1,
}: {
  running: boolean;
  hours: number;
  cups: number;
  scenario: Scenario;
  speed?: number;
}) {
  const entrance = entranceFrame(hours, scenario.hours);
  const totalCups = calculate(scenario).cups;
  const visits = cafeTables.map((_, i) =>
    tableVisitFrame(hours, scenario.hours, totalCups, i),
  );
  const delivery = deliveryFrame(hours, scenario.hours, totalCups);
  return (
    <div
      className={`shop-scene ${running ? "is-running" : ""}`}
      style={{ "--service-step": `${0.5 / speed}s` } as React.CSSProperties}
    >
      <svg
        className="cafe-art"
        viewBox="0 0 1080 520"
        role="img"
        aria-label={`Quán cà phê pixel: chủ quán thu ngân, ${scenario.workers} barista pha chế và phục vụ khách`}
        shapeRendering="crispEdges"
      >
        <defs>
          <radialGradient id="lamp-glow">
            <stop stopColor="#ffe4a2" stopOpacity=".28" />
            <stop offset="1" stopColor="#ffe4a2" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="room-shade" x2="0" y2="1">
            <stop stopColor="#452b1b" stopOpacity=".16" />
            <stop offset=".5" stopColor="#452b1b" stopOpacity="0" />
            <stop offset="1" stopColor="#452b1b" stopOpacity=".12" />
          </linearGradient>
          <pattern
            id="floor"
            width="110"
            height="37"
            patternUnits="userSpaceOnUse"
          >
            <rect width="110" height="37" fill="#bd905f" />
            <path
              d="M0 0h110M0 36h110M55 0v18M0 18h110M16 18v18"
              stroke="#a97b50"
              strokeWidth="2"
            />
          </pattern>
          <pattern
            id="wall"
            width="90"
            height="45"
            patternUnits="userSpaceOnUse"
          >
            <rect width="90" height="45" fill="#e7c997" />
            <path d="M0 44h90M45 0v44" stroke="#dcbf8e" strokeWidth="1" />
          </pattern>
          <linearGradient id="sun">
            <stop stopColor="#9db5a0" />
            <stop offset="1" stopColor="#d9d5a1" />
          </linearGradient>
        </defs>
        <rect width="1080" height="520" fill="url(#wall)" />
        <path d="M17 18h10v252H17zM1053 18h10v252h-10z" fill="#bc8957" />
        <rect y="278" width="1080" height="242" fill="url(#floor)" />
        <path fill="#78523b" d="M0 270h1080v12H0zM0 0h1080v14H0z" />
        <path fill="#af794c" d="M0 14h1080v7H0z" />
        {[54, 800].map((x) => (
          <g key={x}>
            <rect x={x} y="52" width="211" height="174" fill="#76523a" />
            <rect x={x + 8} y="60" width="195" height="158" fill="url(#sun)" />
            <path
              d={`M${x + 10} 169l43-36 40 16 51-55 50 35v85H${x + 10}z`}
              fill="#799477"
            />
            <path
              d={`M${x + 10} 186l58-21 53 24 70-36v61H${x + 10}z`}
              fill="#597e63"
            />
            <path
              d={`M${x + 105} 57v163M${x + 7} 135h195`}
              stroke="#76523a"
              strokeWidth="7"
            />
            <rect x={x - 6} y="219" width="223" height="10" fill="#98663d" />
            <path d={`M${x + 12} 63h50l-50 91z`} fill="#f7e3aa" opacity=".23" />
          </g>
        ))}
        <path fill="#71503a" d="M296 103h263v9H296zM305 164h249v9H305z" />
        {[317, 350, 392, 440, 480, 521].map((x, i) => (
          <g key={x}>
            <rect
              x={x}
              y={i % 2 ? 77 : 72}
              width="19"
              height={i % 2 ? 26 : 31}
              fill={["#a96843", "#657957", "#e4dab4"][i % 3]}
            />
            <rect
              x={x - 2}
              y={i % 2 ? 74 : 69}
              width="23"
              height="5"
              fill="#574534"
            />
            <rect x={x + 5} y="86" width="9" height="9" fill="#f3ddb2" />
          </g>
        ))}
        {[326, 362, 402, 477, 516].map((x) => (
          <DrinkSprite key={x} x={x} y={149} />
        ))}
        <g transform="translate(602 63)">
          <rect width="133" height="103" fill="#765138" />
          <rect x="6" y="6" width="121" height="91" fill="#364e43" />
          <text
            x="66"
            y="29"
            textAnchor="middle"
            fill="#e9deb8"
            fontSize="15"
            fontFamily="monospace"
          >
            TODAY'S MENU
          </text>
          <path d="M17 38h98" stroke="#acb291" />
          <text
            x="18"
            y="58"
            fill="#e9deb8"
            fontSize="12"
            fontFamily="monospace"
          >
            Cà phê {scenario.price / 1000}k
          </text>
          <text
            x="18"
            y="77"
            fill="#c0c9a5"
            fontSize="11"
            fontFamily="monospace"
          >
            Made with ♥
          </text>
        </g>
        {[172, 540, 900].map((x) => (
          <g key={x}>
            <path d={`M${x} 15v33`} stroke="#4d4032" strokeWidth="3" />
            <path d={`M${x - 26} 67l12-21h28l12 21z`} fill="#476452" />
            <rect x={x - 29} y="67" width="58" height="5" fill="#304d3d" />
            <path
              d={`M${x - 21} 73l-55 169h152L${x + 21} 73z`}
              fill="#fff1b9"
              opacity=".09"
            />
            <rect x={x - 10} y="72" width="20" height="4" fill="#ffe4a0" />
          </g>
        ))}
        <g aria-hidden="true">
          <path d="M294 345h421v51H294z" fill="#7b7350" />
          <path d="M300 350h409v41H300z" fill="#a8a077" />
          <path
            d="M308 355h393v31H308z"
            fill="none"
            stroke="#d2c394"
            strokeWidth="3"
          />
          {[
            315, 333, 351, 369, 387, 405, 423, 441, 459, 477, 495, 513, 531,
            549, 567, 585, 603, 621, 639, 657, 675, 693,
          ].map((x) => (
            <path
              key={x}
              d={`M${x} 345v-5m0 56v5`}
              stroke="#827750"
              strokeWidth="3"
            />
          ))}
        </g>
        {(scenario.workers >= 3 || delivery.phase === "waiting") && (
          <BaristaSprite x={293} y={186} shirt="#ead6ab" />
        )}
        <BaristaSprite x={453} y={184} />
        {scenario.workers >= 2 && (
          <BaristaSprite x={569} y={188} shirt="#d6b496" />
        )}
        {scenario.workers >= 4 && (
          <BaristaSprite x={646} y={188} shirt="#ad9767" />
        )}
        {scenario.workers >= 5 && (
          <BaristaSprite x={504} y={184} shirt="#aeb89b" />
        )}
        <rect x="265" y="251" width="450" height="82" fill="#95653e" />
        <path fill="#c38e56" d="M270 265h439v59H270z" />
        {[280, 355, 430, 505, 580, 655].map((x) => (
          <path key={x} d={`M${x} 269v51`} stroke="#ae7948" strokeWidth="3" />
        ))}
        <path fill="#573f2e" d="M253 244h475v13H253z" />
        <path fill="#e0b880" d="M253 238h475v7H253z" />
        <CoffeeMachine />
        <g transform="translate(287 211)">
          <path fill="#37463f" d="M0 0h33v23H0zM-4 23h43v5H-4z" />
          <rect x="4" y="4" width="25" height="13" fill="#a7bea1" />
        </g>
        {delivery.counterCup && (
          <g className="pickup-cup">
            <DrinkSprite x={690} y={225} />
            <DrinkSprite x={710} y={225} />
            <text x="671" y="215" fontSize="10" fill="#4d673c">
              Có đồ uống!
            </text>
          </g>
        )}
        <path fill="#e4d6b1" d="M637 214h31v24h-31z" />
        <path fill="#8e6542" d="M632 213h41v5h-41z" />
        {scenario.workers >= 6 && (
          <BaristaSprite x={612} y={333} shirt="#b88967" carrying />
        )}
        {entrance.ordering && <OrderBubble x={177} y={225} text="2 cà phê" />}
        {visits.map(
          (visit, i) =>
            !visit.occupied &&
            visit.phase !== "empty" && (
              <g
                key={i}
                className="moving-customers"
                data-direction={visit.phase}
              >
                {visit.people.map((person, j) => (
                  <CustomerSprite key={j} {...person} />
                ))}
              </g>
            ),
        )}
        {cafeTables.map((table, i) => (
          <g
            key={i}
            className="customer-table"
            data-served={visits[i].served}
            data-visit={visits[i].phase}
            data-group={visits[i].group}
          >
            <path
              d={`M${table.x + 19} ${table.y - 5}h34v9h-34v-34h5v25m0 9v31h5v-31m19 0v31h5v-31`}
              fill="#684b34"
            />
            <path
              d={`M${table.x - 44} ${table.y - 5}h34v9h-34v-34h5v25m0 9v31h5v-31m19 0v31h5v-31`}
              fill="#684b34"
            />
            {visits[i].occupied &&
              visits[i].people.map((person, index) => (
                <CustomerSprite key={index} {...person} />
              ))}
            <Table x={table.x} y={table.y} served={visits[i].served} />
            {visits[i].served &&
            delivery.tableIndex === i &&
            delivery.reacting ? (
              <g className="customer-thanks">
                <rect
                  x={table.x + 6}
                  y={table.y - 106}
                  width="77"
                  height="28"
                  fill="#fff2cd"
                  stroke="#6e5035"
                  strokeWidth="2"
                />
                <text
                  x={table.x + 44}
                  y={table.y - 87}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#49633c"
                >
                  Cảm ơn! ♥
                </text>
              </g>
            ) : (
              visits[i].phase === "waiting" && (
                <g opacity={delivery.tableIndex === i ? 1 : 0.65}>
                  <rect
                    x={table.x + 24}
                    y={table.y - 97}
                    width="32"
                    height="25"
                    fill="#fff2cd"
                    stroke="#876840"
                    strokeWidth="2"
                  />
                  <DrinkSprite x={table.x + 32} y={table.y - 93} />
                </g>
              )
            )}
          </g>
        ))}
        <g
          visibility={
            scenario.workers < 3 && delivery.phase === "waiting"
              ? "hidden"
              : "visible"
          }
          className={`delivery-server ${delivery.walking ? "is-walking" : ""}`}
          data-phase={delivery.phase}
          data-table={delivery.tableIndex + 1}
          data-carrying={delivery.carrying}
          transform={`translate(${delivery.x} ${delivery.y})`}
        >
          <ellipse cx="18" cy="80" rx="23" ry="5" fill="#654628" opacity=".2" />
          <BaristaSprite
            x={0}
            y={0}
            shirt={scenario.workers >= 3 ? "#c79062" : "#ead6ab"}
            tray
            carrying={delivery.carrying && delivery.phase !== "pickup"}
            flip={delivery.flip}
          />
        </g>
        {delivery.handoff !== null && (
          <g className="coffee-handoff" aria-hidden="true">
            {[0, 1].map((i) => {
              const progress = delivery.handoff!;
              const fromX = 690 + i * 20;
              const toX = delivery.x + 32 - (36 + i * 20);
              return (
                <DrinkSprite
                  key={i}
                  x={fromX + (toX - fromX) * progress}
                  y={
                    225 +
                    (delivery.y + 29 - 225) * progress -
                    Math.sin(progress * Math.PI) * 8
                  }
                />
              );
            })}
          </g>
        )}
        <Plant x={45} y={305} scale={1.4} />
        <Plant x={1030} y={294} scale={1.3} />
        <Plant x={758} y={213} scale={0.7} />
        <g transform="translate(46 369)">
          <rect
            width="107"
            height="36"
            fill="#d9b77f"
            stroke="#8d6745"
            strokeWidth="3"
          />
          <text
            x="53"
            y="23"
            textAnchor="middle"
            fill="#684b34"
            fontFamily="monospace"
            fontSize="13"
          >
            WELCOME
          </text>
        </g>
        <g transform="translate(445 283)">
          <rect width="91" height="28" fill="#e2bd80" />
          <text
            x="46"
            y="19"
            textAnchor="middle"
            fontSize="14"
            fill="#67452f"
            fontFamily="monospace"
          >
            C & S
          </text>
        </g>
        <g aria-hidden="true">
          <ellipse cx="172" cy="150" rx="100" ry="90" fill="url(#lamp-glow)" />
          <ellipse cx="540" cy="150" rx="100" ry="90" fill="url(#lamp-glow)" />
          <ellipse cx="900" cy="150" rx="100" ry="90" fill="url(#lamp-glow)" />
          <rect
            width="1080"
            height="520"
            fill="url(#room-shade)"
            pointerEvents="none"
          />
        </g>
        {cups > 0 && (
          <g
            key={`value-${cups}`}
            className="value-particle"
            aria-hidden="true"
          >
            <text
              x="568"
              y="207"
              fill="#fff7d1"
              fontWeight="bold"
              fontSize="17"
            >
              +{money(scenario.price)}
            </text>
          </g>
        )}
      </svg>
      <div className="scene-top">
        <span className="scene-tag">
          <span className={running ? "live-dot" : ""} />{" "}
          {running
            ? "QUÁN ĐANG HOẠT ĐỘNG"
            : hours === scenario.hours
              ? "HẸN GẶP LẠI NGÀY MAI"
              : "COFFEE & SOCIETY · SẴN SÀNG ĐÓN KHÁCH"}
        </span>
        <span className="scene-tag">
          <Sun size={15} aria-hidden="true" /> {clock(8 + hours)}
        </span>
      </div>
      <div className="scene-bottom">
        <span>
          <Users size={15} aria-hidden="true" /> {scenario.workers} barista{" "}
          <i /> {visits.filter((v) => v.occupied).length}/3 bàn có khách
        </span>
        <span>
          <Coffee size={15} aria-hidden="true" /> {cups} ly đã pha · Giao ly
          minh họa
        </span>
      </div>
    </div>
  );
}
