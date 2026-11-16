import { Button } from './ui/Button';
import { useState, type CSSProperties } from 'react';
import { builtinWelcomeImage, type WelcomeSettings } from '../server/startup-types';
import { useDesktopWindowMode } from './desktop-chrome';
import { welcomeImage } from './WelcomeScreen';
import mark from '../desktop/mark.svg';
import { brand } from '../server/brand';
import '../desktop/setup.css';

export function DesktopStartup({ settings, message, error, onRetry, image, preview = false }: { settings: WelcomeSettings; message: string; error: boolean; onRetry(): void; image?: string; preview?: boolean }) {
  const [failed, setFailed] = useState<string[]>([]);
  const source = image ?? welcomeImage(settings);
  const picture = source && !failed.includes(source) ? source : settings.background === 'plain' || failed.includes(builtinWelcomeImage) ? undefined : builtinWelcomeImage;
  useDesktopWindowMode(picture ? 'welcome-artwork' : 'welcome', !preview);
  return <div className={'desktop-startup' + (preview ? ' desktop-startup-preview' : '')} data-phase={error ? 'error' : 'starting'} data-artwork={!!picture}>
    {picture && <img className="startup-background" src={picture} alt="" fetchPriority="high" style={{ objectPosition: `${settings.desktopFocus.x}% ${settings.desktopFocus.y}%` }} onError={() => setFailed(value => [...value, picture])} />}
    <div className="startup-shade" style={{ opacity: picture ? settings.shade / 100 : 0 } as CSSProperties}/><div className="startup-vignette"/>
    <main className="startup-main">
      <div className="startup-stack">
        <section className="startup-brand" aria-label="哔哔音乐启动页">
          <div className="startup-emblem-wrap">
            <div className="startup-glow" aria-hidden="true"/>
            <img className="startup-mark" src={mark} alt={brand.name}/>
          </div>
          <div className="startup-title-group">
            <h1>{brand.name}</h1>
            <span className="startup-pill">BiBi</span>
          </div>
          <p className="startup-tagline">{brand.tagline}</p>
        </section>
        <footer className="startup-footer">
          <div className="startup-tuner" aria-hidden="true">
            <div className="startup-waves">
              <span/><span/><span/><span/><span/>
            </div>
          </div>
          <div className="startup-loader" aria-hidden="true"><span/></div>
          <div className="startup-status-box">
            <span className="startup-pulse-dot" aria-hidden="true"/>
            <div className="startup-status" role={error ? 'alert' : 'status'} aria-live="polite">{message}</div>
          </div>
          {error && <div className="startup-actions"><Button variant="plain" onClick={onRetry}>重试</Button><Button variant="plain" className="secondary" onClick={() => void window.biBiMusicDesktop?.openDirectory('logs')}>打开日志文件夹</Button><Button variant="plain" className="quiet" onClick={() => window.biBiMusicDesktop?.quit()}>退出</Button></div>}
          <p className="startup-caption">搜索音乐 · 选择版本 · 整理歌单</p>
        </footer>
      </div>
    </main>
  </div>;
}
