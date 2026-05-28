from collections import defaultdict

def find_potential_duplicates(skus: list[str]):

    groups = defaultdict(list)

    for sku in skus:
        normal = string_normalization(sku)
        groups[normal].append(sku)

    duplicates = {
        key: value
        for key, value in groups.items()
        if len(value) > 1
    }

    return duplicates


def string_normalization(sku: str) -> str:
    normal_text = ( 
        sku
        .lower()
        .replace(" ", "")
        .replace("-","")
        .strip()
    )
      
    return normal_text


print(find_potential_duplicates(['SFALTA001', 'SFA-LTA-001']))