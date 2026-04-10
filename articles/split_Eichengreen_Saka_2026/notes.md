# Reading Notes: Eichengreen & Saka (2026)
## "Cultural Stereotypes of Multinational Banks"
### *Journal of the European Economic Association* 24(2): 567–609
### DOI: 10.1093/jeea/jvaf032 | Open Access

---

## 1. Research Question
**Core question:** Do cultural trust biases (stereotypes) shape multinational banks' cross-border sovereign debt exposures?

When residents of the countries where a multinational bank operates exhibit higher bilateral trust toward residents of a target country, does the bank hold more sovereign debt of that target country?

**Why it matters:** Prior literature showed bilateral trust affects trade, FDI, and portfolio investment at the country level. This paper asks whether trust operates at the level of individual banks — and whether that mechanism runs through sovereign bond markets (the "safest asset"), which would rule out rational risk-perception explanations.

---

## 2. Audience
- International finance / banking economists
- Cultural economics researchers (trust, social capital, cross-border behavior)
- Researchers on sovereign debt portfolios and Eurozone crisis dynamics
- Organizational economists (hierarchies, internal capital markets in MNCs)

---

## 3. Method / Identification Strategy
**Key innovation:** Rather than using country-level bilateral trust (which is correlated with many unobservables), the authors construct a **bank-specific measure of trust**.

Construction:
1. Assign to each bank branch the bilateral trust of its host country toward each target country (from survey data)
2. Aggregate to the bank level using a weighted average, where weights = share of host-country branches in the bank's total branch network
3. This produces a measure specific to both the **bank** and the **target country**

**Main identification:** Compare banks **headquartered in the same home country**, facing the **same target country**, at the **same point in time** — exploiting variation in branch network geography across banks. This absorbs country-pair and time confounders.

**Fixed effects:** Time-varying FE at bank level and country-pair level. Saturates away common shocks.

**IV:** Instrument trust with genetic distance and somatic (physical appearance) similarity between nations — standard instruments in the cultural economics literature.

---

## 4. Data

| Dataset | Variable | Source | Coverage |
|---|---|---|---|
| EBA / CEBS stress test disclosures | Sovereign debt portfolio (country breakdown) | EBA/CEBS websites; PIIE for 2010 | 199 banks, 27 home countries, 22 year-quarters (2010–~2022), unbalanced panel |
| EBA disclosures | Corporate sector cross-border exposures | EBA (manually collected) | Subset of banks and periods |
| EBA disclosures | Maturity breakdown of sovereign exposures | EBA (manually collected) | Subset of banks and periods |
| Eurobarometer (1996) | Bilateral trust across 15 European countries | Eurobarometer | 15 home × 15 target countries |
| New online survey (2022) | Bilateral trust across 30 European countries | Authors' own nationally representative survey | 30 countries |
| SNL Financial (Feb 2016) | Bank branch networks across European countries | SNL Financial | 137,284 branches; single cross-section |
| BankFocus | Nationality of board/management at HQ | BankFocus | Mechanisms analysis |
| Hassan et al. (2024) | Earnings call sentiments (country-specific tone) | Published dataset | Mechanisms analysis |

**Unit of observation:** Bank × target country × time (year-quarter)

**Sample sizes:**
- Country-level analysis: 159 banks, 22 year-quarters
- Bank-level trust analysis (with branch data): **108 banks**, 15 target countries (Eurobarometer) → 1,620 obs; 30 target countries (new survey) → 3,240 obs
- Sovereign exposure dummy: 23,760 obs; Corporate exposure: 18,255 obs

**Outcome variable:** "Gross Direct Long Exposures" (banking + trading books) — the only category consistently available across all EBA/CEBS disclosures

**Trust variable (benchmark):** % of residents in home country saying "a lot of trust" toward residents of target country (Eurobarometer 1996, last wave with this question)

**Trust bias:** Bank-level trust *relative to* the average trust toward that target country (demeaned within target country)

**Diversification gap:** Unconditional probability of holding any bonds of a target country = 58% in bank-level sample (56% country-level); gap from full diversification = ~42–44%

---

## 5. Statistical Methods

**Main specification (Equation 1):**
```
Sovereign Exposure_b,h,c,t = β1 Bank-level Trust Bias_bc + β2 Bank Branches_bc 
                              + β3 γ_bt + β4 λ_hct + ε_bhct
```
- Linear probability model (LPM); also checked log nominal as robustness
- `γ_bt` = bank × time FEs; `λ_hct` = home-country × target-country × time FEs (most saturated)
- SE clustered by bank; robust to double-clustering at country-pair × time or country-pair × bank

**Trust bias construction (Equation 2 + 3):**
- Country-level trust bias = residual from gravity regression of bilateral trust on home-country and target-country FEs (follows Pursiainen 2022)
- Bank-level trust bias = branch-weighted average of country-level trust biases across host countries

**IV strategy:**
- Instruments: genetic distance (Cavalli-Sforza et al. 1996) and somatic distance (Biasutti 1954) — both from Guiso, Sapienza, Zingales (2009)
- Aggregated to bank–target-country level using branch network weights

**Controls tested:**
- Branch penetration (linear + quadratic), historical merger activity, media coverage (Factiva), social media (Facebook/Meta), political alignment (UNGA voting), geographic distance, legal origin, religious similarity
- Cultural distance: Hofstede (1980/2001) PC1, Schwartz (1994) PC1, Gelfand et al. (2011) tightness, Pellegrino et al. (forthcoming) WVS-based

**Robustness:**
- Placebo: randomly reassign branch networks → no spurious results
- Subsample: SSM banks only, Eurozone only, no crisis countries, no home-country observations
- Exclude target countries where bank has branch presence

---

## 6. Findings

### 6.1 Baseline (Table 2)
- **Most saturated spec (col 5):** β = **1.562*** [0.310]**, home-country × target-country × time FEs
- **1 SD rise in trust bias → +14 pp probability** of holding a target country's sovereign bonds
- Accounts for **one-third of the 42% diversification gap**
- = one-fourth of the unconditional mean (58%)
- **Log nominal:** 1 SD → **>105% increase** in volume of sovereign lending
- Effect **stable across all 11 sub-periods from 2010–2021** (Figure 2)

### 6.2 No-branch robustness (Table 3)
- Restricting to target countries where *none* of the compared banks has branches: β = **1.972*** [0.734]** — *larger*, not smaller
- Rules out financial linkages through branch presence as confound

### 6.3 Relationship controls (Table 4)
- Adding 8 indirect linkage controls (merger, media, political, distance, legal, religion, social media): none statistically significant
- Trust bias remains significant: β ranges from **1.121** to **1.562** across specs
- Branch networks transmit cultural stereotypes specifically, not other relationship types

### 6.4 Maturity structure (Figure 3)
- Trust matters across all maturities but is strongest for long-term bonds
- β(>10Y) − β(<3M) = **0.617** (p=0.06) full sample; **1.201** (p=0.02) foreign subsample
- Interpretation: high trust → willingness to lock in long-term; low trust → preference for exit option

### 6.5 IV estimates (Table 5)
| Instrument | β (2SLS) | First-stage KP F-stat |
|---|---|---|
| Genetic distance (full) | 3.014*** [0.871] | 123.84 |
| Somatic distance (full) | 2.037*** [0.531] | 221.00 |
| Genetic distance (foreign) | 4.491*** [1.608] | 74.65 |
| Somatic distance (foreign) | 2.658*** [0.874] | 69.15 |
- Most conservative IV: 1 SD → **+18% probability**, nearly **half of diversification gap**
- All F-stats well above Stock-Yogo threshold of 10

### 6.6 Cultural distance controls (Table 6)
- All four cultural distance measures (Hofstede, Schwartz, Gelfand, Pellegrino) have expected negative sign
- Trust bias remains significant after controlling for all four: β = **1.287*** [0.439]**
- Trust has a distinct effect, not reducible to cultural distance

### 6.7 New 2022 survey — external validity (Table 7)
- Eurobarometer 1996 vs. new online survey 2022 (30 countries, conducted by Respondi)
- Correlation in trust levels: **0.72**; trust biases: **0.75** — both significant at 1%
- Results with new survey: β = **1.561*** [0.470]** (col 5) — virtually identical to baseline
- Confirms trust biases are persistent over 25+ years and results generalize to 30 countries

### 6.8 Corporate exposures (Table 8)
- Dummy: β = **1.556*** [0.484]**; Log nominal: β = **12.751*** [3.498]**
- Trust shapes corporate lending across borders, not just sovereign debt
- Confirms external validity of bank-level trust measure

### 6.9 Heterogeneity (Figure 5)
- **Bank size:** effect holds for both large (β=1.354) and small (β=1.838) banks — not significantly different
- **Diversification:** effect significantly stronger for *non-diverse* banks (β=2.134) vs. *diverse* banks (β=0.740); p=0.02
  - Interpretation: sophisticated, diversified banks have more hard information → less reliance on stereotypes
- **Target country commonness:** stronger for less common target countries (β=1.893 vs. 1.018); familiarity mitigates trust's role

### 6.10 Salience shocks (Section 5.6)
- **Eurozone crises** (>400 bps spread above Germany): total trust effect (interaction + baseline) ≥ **3× baseline**
- **Brexit referendum** (June 23, 2016): significant positive interaction for intensive margin (log nominal) but not extensive margin — EU banks reduce (not exit) UK debt when trust is low

---

## 7. Contributions
1. First **bank-level** (rather than country-level) identification of trust's role in cross-border investment
2. First systematic study of cultural trust stereotypes in **sovereign bond markets** (safest asset class → rules out rational risk perceptions)
3. First systematic evidence of **transmission of cultural biases via bank branch networks**
4. First to document both a **communication channel** (biased soft information up the hierarchy via earnings call sentiments) and a **human capital channel** (internal cross-border hiring mirrors branch geography)
5. New nationally representative bilateral trust survey across **30 European countries (2022)**, complementing 1996 Eurobarometer
6. Policy implication: **diverse management teams** buffer against cultural bias in portfolio allocation

---

## 8. Mechanisms (Section 6)

### 8.1 Communication channel (Table 9)
- Uses Hassan et al. (2024) earnings call sentiment dataset (2002–2020)
- Specification: Managerial Sentiments_h,c,t = β1 Country-level Trust Bias_hc + home-country × time FEs + target-country × time FEs
- **Result:** 1 SD rise in trust bias → **0.16 more positive tone** in managerial sentiments (>50% of SD)
- Holds for financial firms alone and for all firms
- Holds across Eurobarometer and new survey measures

### 8.2 Human capital channel (Table 10)
- Uses BankFocus data on nationalities of current/former directors and managers at HQ
- Specification: Nationality at HQ_b,h,c = β1 Bank Branches_bc + bank FEs + target-country FEs + home × target FEs
- **Result (col 5):** 1 SD increase in log branches in target country → **+8.4% probability** of that nationality represented at HQ
- = one-third of mean outcome variable
- Banks hire and promote internally → branch geography shapes boardroom composition → shared stereotypes at top

---

## 9. Replication Feasibility

| Data source | Availability |
|---|---|
| EBA/CEBS sovereign portfolio disclosures | **Public** (EBA website; 2010 wave from PIIE) |
| Eurobarometer 1996 bilateral trust | **Public** |
| New 2022 online trust survey (30 countries) | **Authors' own** — may be in supplementary data |
| SNL Financial branch network data | **Proprietary** (Feb 2016 snapshot) |
| BankFocus director/manager nationalities | **Proprietary** |
| Hassan et al. (2024) earnings call sentiments | **Published dataset** (Review of Economic Studies) |
| Genetic/somatic distance (GSZ 2009) | **Public** (Guiso, Sapienza, Zingales appendix) |
| Facebook social media connections | **Unclear** — described as a control variable |
| Hofstede, Schwartz, Gelfand, Pellegrino cultural distances | **Public** |

**Overall assessment:** Core results partially replicable with public data (EBA + Eurobarometer + cultural distance measures). Full replication requires SNL Financial subscription (branch networks) and BankFocus subscription (management nationalities). Supplementary data available at JEEA online.

---

---

## 10. Dataset Inspection — `Eichengreen&Saka_BilateralTrust_Database.xlsx`

### Structure
- **2 sheets:** `Readme` and `Database`
- **900 observations** (30 × 30 country pairs, including self-pairs)
- **8 columns** — no missing values

| Variable | Description |
|---|---|
| `o_country` | Origin country (where trust is expressed) |
| `d_country` | Destination country (toward which trust is expressed) |
| `o_code` / `d_code` | ISO 2-letter country codes |
| `trust_rspdi` | % of respondents expressing "a lot of trust" (binary) |
| `trust_rspdi2` | Average trust score 1–4 (graded/continuous) |
| `trustbias_rspdi` | Residual from gravity regression on origin + destination FEs (binary) |
| `trustbias_rspdi2` | Residual from gravity regression on origin + destination FEs (graded) |

### Coverage
- **30 European countries:** Austria, Belgium, Bulgaria, Cyprus, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Ireland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden, United Kingdom
- Survey conducted **June–December 2022** by **Respondi** (nationally representative, online)
- This is the **2022 new survey** constructed for the paper — not Eurobarometer

### Summary Statistics
| Variable | Min | Mean | Max |
|---|---|---|---|
| `trust_rspdi` | 0.031 | 0.244 | 0.684 |
| `trust_rspdi2` | 1.807 | 2.956 | 3.717 |
| `trustbias_rspdi` | −0.139 | 0.000 | 0.362 |
| `trustbias_rspdi2` | −0.475 | 0.000 | 0.778 |

### Most & Least Trusted Pairs (binary, excl. self-pairs)
**Highest trust:**
- Norway → Iceland: 0.684
- Iceland → Denmark/Finland/Sweden: 0.680
- Norway → Denmark: 0.680

**Lowest trust:**
- Czech Republic → Bulgaria: 0.043
- Czech Republic → Romania: 0.031

### Most Extreme Trust Biases (residual, excl. self-pairs)
**Most positive (over-trusted relative to average):**
- Greece → Cyprus: +0.241
- Liechtenstein → Austria: +0.231
- Norway → Iceland: +0.224
- Latvia → Estonia: +0.223
- Czech Republic → Slovakia: +0.213

**Most negative (under-trusted relative to average):**
- Poland → Germany: −0.139
- Lithuania → Austria: −0.119
- Norway → Spain: −0.111
- Greece → Germany: −0.108
- Germany → Poland: −0.108

### Key Observations
- The Scandinavian/Nordic bloc (Norway, Iceland, Denmark, Sweden, Finland) shows consistently high bilateral trust
- The most dramatic positive biases reflect geographic/linguistic/historical proximity: Greece–Cyprus, Liechtenstein–Austria (German-speaking), Norway–Iceland, Baltic states among themselves, Czech–Slovak (former Czechoslovakia), Belgium–Luxembourg, Malta–UK
- Most negative biases: Poland↔Germany mutual distrust is the strongest signal; Greece–Germany distrust (Eurozone crisis legacy) clearly visible
- The dataset is **publicly distributed** with citation requirement; latest version available at www.orkunsaka.com

*Dataset inspection: 2026-04-10*
