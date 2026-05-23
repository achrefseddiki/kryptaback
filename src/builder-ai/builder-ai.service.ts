import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ProductsService } from '../products/products.service';
import { SuggestDto } from './dto/suggest.dto';

const SLOT_CATEGORY: Record<string, string> = {
  CPU:  'cpus',
  GPU:  'gpus',
  MB:   'motherboards',
  RAM:  'ram',
  SSD:  'storage',
  PSU:  'power',
  CASE: 'cases',
  COOL: 'cooling',
};

@Injectable()
export class BuilderAiService {
  private readonly logger = new Logger(BuilderAiService.name);
  private readonly client = new Anthropic();

  constructor(private readonly productsService: ProductsService) {}

  async suggest(dto: SuggestDto) {
    const { selectedComponents, targetSlot, targetLabel, budget } = dto;

    const categorySlug = SLOT_CATEGORY[targetSlot];
    if (!categorySlug) {
      return { suggestions: [] };
    }

    const currentTotal = selectedComponents.reduce((sum, c) => sum + c.price, 0);
    const maxPrice = budget != null ? budget - currentTotal : undefined;

    const { data: candidates } = await this.productsService.findAll({
      category: categorySlug,
      ...(maxPrice != null && maxPrice > 0 ? { maxPrice } : {}),
      limit: 25,
      page: 1,
    });

    if (candidates.length === 0) {
      return { suggestions: [] };
    }

    const currentBuildText = selectedComponents.length > 0
      ? selectedComponents
          .map(c => `- ${c.label} (${c.slot}): ${c.productName} — ${c.price} DT — Specs: ${c.specs.join(', ')}`)
          .join('\n')
      : 'No components selected yet.';

    const candidateText = candidates
      .map((p, i) =>
        `${i + 1}. ID: ${p.id} | ${p.name} | ${p.brand} | ${p.price} DT | Specs: ${p.specs.join(', ')}`
      )
      .join('\n');

    const budgetLine = budget != null
      ? `Total budget: ${budget} DT. Already spent: ${currentTotal} DT. Remaining: ${Math.max(0, budget - currentTotal)} DT.`
      : 'No budget constraint.';

    const userMessage = `Current PC build:
${currentBuildText}

${budgetLine}

Available options for the ${targetLabel} (${targetSlot}) slot:
${candidateText}

Suggest the 3 most compatible and suitable options. Prioritize hardware compatibility (sockets, form factors, power requirements), then value for money within budget.`;

    try {
      const message = await this.client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: `You are a PC hardware compatibility expert for Krypta, a Tunisian PC store.
Given a partial build and candidate products, suggest the best compatible options.
Respond ONLY with a valid JSON array, no markdown fences, no extra text:
[{"productId":"<id>","reason":"<one sentence why this fits>"},...]
Return at most 3 items. If nothing is compatible return [].`,
        messages: [{ role: 'user', content: userMessage }],
      });

      const raw = (message.content[0] as { type: string; text: string }).text.trim();
      const parsed: { productId: string; reason: string }[] = JSON.parse(raw);

      const suggestions = parsed
        .map(({ productId, reason }) => {
          const product = candidates.find(p => p.id === productId);
          if (!product) return null;
          return {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            price: product.price,
            img: product.img,
            specs: product.specs,
            reason,
          };
        })
        .filter(Boolean);

      return { suggestions };
    } catch (err) {
      this.logger.error('AI suggest failed', err);
      return { suggestions: [] };
    }
  }
}
