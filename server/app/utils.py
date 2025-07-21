def calculate_mb(rating: float, price: float) -> float:
    """
    Calculate Maximum Benefit (MB):
    MB = Rating / Price
    - Higher rating and lower price = better MB.
    - Rounded to 4 decimal places.

    Examples:
    >>> calculate_mb(4.5(rating), 900(price))
    0.005

    >>> calculate_mb(5.0(rating), 0(price))
    0.0  # Avoids division by zero
    """
    if price == 0:
        return 0.0
    return round(rating / price, 4)


def calculate_cb(price: float, rating: float, delivery_cost: float) -> float:
    """
    Calculate Cost-Benefit (CB) Score:
    A weighted score using:
      - 50% weight for price (lower is better)
      - 30% weight for rating (higher is better)
      - 20% weight for delivery cost (lower is better)

    Formula:
    CB = 0.5 * (1 / price) + 0.3 * (rating / 5) + 0.2 * (1 / delivery_cost)

    All inputs should be > 0 to avoid division by zero.Rounded to 4 decimal places.

    Example
    >>> calculate_cb(1000, 4.5, 100)
    0.5 * (1/1000) + 0.3 * (4.5/5) + 0.2 * (1/100)
    = 0.0005 + 0.27 + 0.002 = 0.2725
    """
    try:
        price_component = 0.5 * (1 / price) if price else 0
        rating_component = 0.3 * (rating / 5) if rating else 0
        delivery_component = 0.2 * (1 / delivery_cost) if delivery_cost else 0

        cb = price_component + rating_component + delivery_component
        return round(cb, 4)
    except ZeroDivisionError:
        return 0.0
