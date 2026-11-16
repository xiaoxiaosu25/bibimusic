import { useState, type CSSProperties, type ReactNode } from 'react';
import { HeadphonesIcon } from '@phosphor-icons/react';
import { brand } from '../server/brand';
import { builtinWelcomeImage, type WelcomeSettings } from '../server/startup-types';
import { ThemeToggle } from './ThemeControls';
import { useDesktopWindowMode } from './desktop-chrome';

export function welcomeImage(settings:WelcomeSettings) { return settings.background==='plain'?undefined:settings.background==='custom'&&settings.imageId?'/api/welcome/image/'+encodeURIComponent(settings.imageId):builtinWelcomeImage; }
export function WelcomeScreen({settings,image,children,preview=false}:{settings:WelcomeSettings;image?:string;children:ReactNode;preview?:boolean}) {
  const source=image??welcomeImage(settings),[failed,setFailed]=useState<string[]>([]);
  const picture=source&&!failed.includes(source)?source:settings.background==='plain'||failed.includes(builtinWelcomeImage)?undefined:builtinWelcomeImage;
  useDesktopWindowMode(picture?'welcome-artwork':'welcome', !preview);
  const style={'--welcome-x':settings.desktopFocus.x+'%','--welcome-y':settings.desktopFocus.y+'%','--welcome-mobile-x':settings.mobileFocus.x+'%','--welcome-mobile-y':settings.mobileFocus.y+'%','--welcome-shade':settings.shade/100} as CSSProperties;
  return <div className={'welcome-screen'+(preview?' welcome-screen-preview':'')} style={style} data-position={settings.position} data-background={picture?settings.background:'plain'}>
    {picture&&<img className="welcome-background" src={picture} alt="" onError={()=>setFailed(value=>[...value,picture])} fetchPriority="high"/>}
    <div className="welcome-shade"/>
    <div className="welcome-layout">
      <header className="welcome-header"><span className="welcome-signature"><HeadphonesIcon size={23} weight="bold"/><span>{brand.english}</span></span>{!preview&&<ThemeToggle/>}</header>
      <main className="welcome-content">
        <section className="welcome-card" aria-label="欢迎来到哔哔音乐">
          <h1>{brand.name}</h1><p className="welcome-tagline">{brand.tagline}</p>
          <div className="welcome-action">{children}</div>
        </section>
      </main>
      <footer className="welcome-footer"><span>B站音乐播放器</span><span>{brand.english} · 第三方应用</span></footer>
    </div>
  </div>;
}
