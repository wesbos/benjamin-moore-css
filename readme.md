![](./gorg.png)

## Benjamin Moore Paint Colours as CSS Variables

Ever want to make your website Benjamin Moore's Chantilly lace?

Now you can:

```css
:root {
  --chantilly-lace: #F4F6F1;
  --new-york-state-of-mind: #355473;
}

body {
  background: var(--chantilly-lace);
  border: 2px dotted var(--new-york-state-of-mind);
}
```

There are about 4,100 colours so you probably don't want to load the entire `all.css` file into your project (40k gzipped, that is kinda big!).

Visit [bm.wesbos.com](https://bm.wesbos.com) and copy + paste them as you need them.


## Legal

The colour names are owned Benjamin Moore. Hopefully they don't DMCA me.

Benjamin, (can I call you ben?) if you are reading this, I'm happy to take it down if you don't want it up. We just love your colours.

