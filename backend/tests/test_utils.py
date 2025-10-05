from backend.utils import wilson_ci
def test_wilson_ci_bounds():
    c,(lo,hi) = wilson_ci(0.5, 100)
    assert 0 <= lo <= c <= hi <= 1
