import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          The Most Feature-Complete FREE PDF Library for React Native
        </Heading>
        <p className="hero__subtitle">
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className="cta-button cta-button-primary"
            to="/docs/getting-started/installation">
            Get Started
          </Link>
          <Link
            className="cta-button cta-button-secondary"
            to="https://www.youtube.com/shorts/OmCUq9wLoHo"
            target="_blank">
            View Demo
          </Link>
        </div>
        <div className={styles.installCommand}>
          <code>npm install react-native-pdf-jsi react-native-blob-util</code>
        </div>
      </div>
    </header>
  );
}

function FeatureGrid() {
  const features = [
    {
      title: '⚡ 80x Faster',
      description: 'JSI acceleration for direct JavaScript-to-Native communication. No bridge overhead.',
    },
    {
      title: '✅ Google Play Ready',
      description: '16KB page size compliant. Ready for Android 15+ requirements.',
    },
    {
      title: '🎨 Advanced Features',
      description: 'Bookmarks, export, PDF operations, and analytics - all included FREE.',
    },
    {
      title: '🆓 100% Free',
      description: 'No licensing costs. Build commercial apps without restrictions.',
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="feature-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PerformanceTable() {
  return (
    <section className={styles.performance}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Performance Breakthrough
        </Heading>
        <div className={styles.tableWrapper}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Standard Bridge</th>
                <th>JSI Mode</th>
                <th>Improvement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Page Render</td>
                <td>45ms</td>
                <td>2ms</td>
                <td><strong>22.5x faster</strong></td>
              </tr>
              <tr>
                <td>Page Metrics</td>
                <td>12ms</td>
                <td>0.5ms</td>
                <td><strong>24x faster</strong></td>
              </tr>
              <tr>
                <td>Cache Access</td>
                <td>8ms</td>
                <td>0.1ms</td>
                <td><strong>80x faster</strong></td>
              </tr>
              <tr>
                <td>Text Search</td>
                <td>120ms</td>
                <td>15ms</td>
                <td><strong>8x faster</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function DemoVideo() {
  return (
    <section className={styles.demoSection}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          See It In Action
        </Heading>
        <div className="video-container">
          <iframe
            src="https://www.youtube.com/embed/OmCUq9wLoHo"
            title="react-native-pdf-jsi Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="text--center margin-top--md" style={{fontSize: '0.9rem', opacity: 0.8}}>
          60-second demo showing bookmarks, export, PDF operations, and analytics
        </p>
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <section className={styles.whyChoose}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Why choose react-native-pdf-jsi?
        </Heading>
        <div className={styles.tableWrapper}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>react-native-pdf-jsi</th>
                <th>react-native-pdf</th>
                <th>react-native-pdf-lib</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>JSI Acceleration</td>
                <td><span className="badge badge-free">✓ YES</span></td>
                <td>✗ No</td>
                <td>✗ No</td>
              </tr>
              <tr>
                <td>Google Play 16KB</td>
                <td><span className="badge badge-compliant">✓ Compliant</span></td>
                <td>✗ Not supported</td>
                <td>✗ Unknown</td>
              </tr>
              <tr>
                <td>Bookmarks with Colors</td>
                <td><span className="badge badge-free">✓ FREE</span></td>
                <td>✗ No</td>
                <td>✗ No</td>
              </tr>
              <tr>
                <td>Export to Images</td>
                <td><span className="badge badge-free">✓ FREE</span></td>
                <td>✗ Limited</td>
                <td>✗ No</td>
              </tr>
              <tr>
                <td>PDF Operations</td>
                <td><span className="badge badge-free">✓ FREE</span></td>
                <td>✗ No</td>
                <td>✗ Limited</td>
              </tr>
              <tr>
                <td>Reading Analytics</td>
                <td><span className="badge badge-free">✓ FREE</span></td>
                <td>✗ No</td>
                <td>✗ No</td>
              </tr>
              <tr>
                <td>Lazy Loading</td>
                <td><span className="badge badge-free">✓ Built-in</span></td>
                <td>✗ Manual</td>
                <td>✗ No</td>
              </tr>
              <tr>
                <td>Smart Caching</td>
                <td><span className="badge badge-free">✓ 30-day</span></td>
                <td>Basic</td>
                <td>Basic</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className={styles.ctaSection}>
      <div className="container text--center">
        <Heading as="h2" className="margin-bottom--md">
          Ready to Build Amazing PDF Apps?
        </Heading>
        <p className="margin-bottom--lg" style={{fontSize: '1.25rem'}}>
          Get started in 5 minutes. No licensing costs, no hidden fees.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/installation">
            Get Started Now
          </Link>
          <Link
            className="button button--secondary button--lg margin-left--md"
            to="https://github.com/126punith/react-native-enhanced-pdf"
            target="_blank">
            Star on GitHub ⭐
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - The Complete PDF Solution`}
      description="The fastest and most feature-complete FREE React Native PDF library with JSI acceleration, bookmarks, export, PDF operations, and analytics.">
      <HomepageHeader />
      <main>
        <FeatureGrid />
        <PerformanceTable />
        <DemoVideo />
        <WhyChoose />
        <CallToAction />
      </main>
    </Layout>
  );
}
